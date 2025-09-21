import multer from 'multer';
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import Study from '../models/Study.js';
import Mapping from '../models/Mapping.js';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || 
        file.mimetype === 'application/vnd.ms-excel' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed'));
    }
  }
});

// Normalize text by trimming, uppercasing, and removing extra whitespace
const normalizeText = (text) => {
  if (!text) return '';
  return text.toString().trim().toUpperCase().replace(/\s+/g, ' ');
};

const processFile = async (filePath) => {
  try {
    // Read the file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    
    // Parse and validate data
    const parsedData = [];
    const errors = [];
    let mappedCount = 0;
    let unmappedCount = 0;
    let fuzzyCount = 0;
    
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      
      // Validate required fields
      if (!row['Workflow ID'] || !row['Procedure'] || !row['Modality']) {
        errors.push(`Row ${i + 2}: Missing required fields (Workflow ID, Procedure, or Modality)`);
        continue;
      }
      
      // Create study object
      const studyData = {
        workflow_id: row['Workflow ID'].toString(),
        mrn: row['MRN'] ? row['MRN'].toString() : null,
        procedure_raw: row['Procedure'].toString(),
        report_comp_time: row['Report Comp Time'] ? new Date(row['Report Comp Time']) : null,
        final_rad_name: row['Final Rad'] ? row['Final Rad'].toString() : null,
        modality: row['Modality'].toString(),
        hospital_name: row['Hospital'] ? row['Hospital'].toString() : null,
        image_count: row['Image Count'] ? parseInt(row['Image Count']) : null,
        patient_name: row['Patient'] ? row['Patient'].toString() : null
      };
      
      // Try to map the procedure
      const normalizedModality = normalizeText(studyData.modality);
      const normalizedProcedure = normalizeText(studyData.procedure_raw);
      
      const { mapping, confidence } = await Mapping.findByModalityAndProcedure(
        normalizedModality, 
        normalizedProcedure
      );
      
      if (mapping) {
        studyData.type = mapping.type;
        studyData.typedr = mapping.typedr;
        studyData.mapped_by = null; // Will be set when saved
        studyData.mapping_confidence = confidence;
        
        if (confidence === 'exact') {
          mappedCount++;
        } else {
          fuzzyCount++;
        }
      } else {
        studyData.type = null;
        studyData.typedr = null;
        studyData.mapped_by = null;
        studyData.mapping_confidence = 'manual';
        unmappedCount++;
      }
      
      parsedData.push(studyData);
    }
    
    // Save to database
    const savedStudies = [];
    for (const studyData of parsedData) {
      try {
        // Check for duplicates
        const existingStudy = await Study.findByWorkflowId(studyData.workflow_id);
        if (!existingStudy) {
          const savedStudy = await Study.create(studyData);
          savedStudies.push(savedStudy);
        }
      } catch (error) {
        errors.push(`Error saving study ${studyData.workflow_id}: ${error.message}`);
      }
    }
    
    return {
      total: jsonData.length,
      parsed: parsedData.length,
      saved: savedStudies.length,
      mapped: mappedCount,
      fuzzy: fuzzyCount,
      unmapped: unmappedCount,
      errors,
      data: parsedData.slice(0, 50) // Return first 50 rows for preview
    };
  } catch (error) {
    throw new Error(`Error processing file: ${error.message}`);
  }
};

const uploadController = {
  upload: upload.single('file'),
  
  processUpload: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const result = await processFile(req.file.path);
      
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      
      res.json({
        message: 'File processed successfully',
        ...result
      });
    } catch (error) {
      // Clean up uploaded file if exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({ error: error.message });
    }
  },
  
  getPreview: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // Read the file
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON and get first 50 rows
      const jsonData = xlsx.utils.sheet_to_json(worksheet);
      const previewData = jsonData.slice(0, 50);
      
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      
      res.json({
        totalRows: jsonData.length,
        previewRows: previewData.length,
        data: previewData
      });
    } catch (error) {
      // Clean up uploaded file if exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({ error: error.message });
    }
  }
};

export default uploadController;