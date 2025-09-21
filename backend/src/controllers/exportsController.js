import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import Study from '../models/Study.js';

const exportsController = {
  // Export studies as CSV
  exportCSV: async (req, res) => {
    try {
      const { filters, columns } = req.body;
      
      // Get studies based on filters
      const studies = await Study.findAllWithFilters(filters);
      
      // Filter columns if specified
      let exportData = studies;
      if (columns && columns.length > 0) {
        exportData = studies.map(study => {
          const filtered = {};
          columns.forEach(col => {
            filtered[col] = study[col];
          });
          return filtered;
        });
      }
      
      // Convert to CSV format
      const ws = xlsx.utils.json_to_sheet(exportData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Studies');
      
      // Generate file
      const fileName = `export_${Date.now()}.csv`;
      const filePath = path.join(process.env.UPLOAD_DIR || './uploads', fileName);
      
      xlsx.writeFile(wb, filePath);
      
      // Send file
      res.download(filePath, fileName, (err) => {
        // Clean up file after download
        if (!err) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Export studies as Excel
  exportExcel: async (req, res) => {
    try {
      const { filters, columns } = req.body;
      
      // Get studies based on filters
      const studies = await Study.findAllWithFilters(filters);
      
      // Filter columns if specified
      let exportData = studies;
      if (columns && columns.length > 0) {
        exportData = studies.map(study => {
          const filtered = {};
          columns.forEach(col => {
            filtered[col] = study[col];
          });
          return filtered;
        });
      }
      
      // Convert to Excel format
      const ws = xlsx.utils.json_to_sheet(exportData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Studies');
      
      // Generate file
      const fileName = `export_${Date.now()}.xlsx`;
      const filePath = path.join(process.env.UPLOAD_DIR || './uploads', fileName);
      
      xlsx.writeFile(wb, filePath);
      
      // Send file
      res.download(filePath, fileName, (err) => {
        // Clean up file after download
        if (!err) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Export invoice as PDF (simplified version)
  exportInvoicePDF: async (req, res) => {
    try {
      const { id } = req.params;
      
      // In a real implementation, this would generate a PDF
      // For now, we'll send a simple text response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice_${id}.pdf`);
      res.send(`PDF Invoice for Invoice ID: ${id}\n\nThis would be a generated PDF in a full implementation.`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default exportsController;