import pool from '../db/connection.js';

class Mapping {
  static async create(mappingData) {
    const { modality, procedure_pattern, type, typedr, priority } = mappingData;

    const query = `
      INSERT INTO mappings (modality, procedure_pattern, type, typedr, priority)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [modality, procedure_pattern, type, typedr, priority];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM mappings ORDER BY modality, priority DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findByModalityAndProcedure(modality, procedure) {
    // Normalize inputs
    const normalizedModality = modality.toString().trim().toUpperCase();
    const normalizedProcedure = procedure.toString().trim().toUpperCase();
    
    // First try exact match
    let query = `
      SELECT * FROM mappings 
      WHERE UPPER(modality) = $1 AND UPPER(procedure_pattern) = $2
      ORDER BY priority DESC
      LIMIT 1
    `;
    
    let result = await pool.query(query, [normalizedModality, normalizedProcedure]);
    if (result.rows.length > 0) {
      return { mapping: result.rows[0], confidence: 'exact' };
    }

    // Then try pattern matching (contains)
    query = `
      SELECT * FROM mappings 
      WHERE UPPER(modality) = $1 AND $2 LIKE '%' || UPPER(procedure_pattern) || '%'
      ORDER BY priority DESC
      LIMIT 1
    `;
    
    result = await pool.query(query, [normalizedModality, normalizedProcedure]);
    if (result.rows.length > 0) {
      return { mapping: result.rows[0], confidence: 'fuzzy' };
    }

    // Try reverse pattern matching
    query = `
      SELECT * FROM mappings 
      WHERE UPPER(modality) = $1 AND UPPER(procedure_pattern) LIKE '%' || $2 || '%'
      ORDER BY priority DESC
      LIMIT 1
    `;
    
    result = await pool.query(query, [normalizedModality, normalizedProcedure]);
    if (result.rows.length > 0) {
      return { mapping: result.rows[0], confidence: 'fuzzy' };
    }

    // Finally try regex pattern matching
    query = `
      SELECT * FROM mappings 
      WHERE UPPER(modality) = $1 AND $2 ~* procedure_pattern
      ORDER BY priority DESC
      LIMIT 1
    `;
    
    try {
      result = await pool.query(query, [normalizedModality, normalizedProcedure]);
      if (result.rows.length > 0) {
        return { mapping: result.rows[0], confidence: 'fuzzy' };
      }
    } catch (e) {
      // Regex error, continue
    }

    return { mapping: null, confidence: 'manual' };
  }

  static async update(id, mappingData) {
    const { modality, procedure_pattern, type, typedr, priority } = mappingData;

    const query = `
      UPDATE mappings 
      SET modality = $1, procedure_pattern = $2, type = $3, typedr = $4, priority = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;

    const values = [modality, procedure_pattern, type, typedr, priority, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM mappings WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  // Add sample mappings for common procedures
  static async addSampleMappings() {
    const sampleMappings = [
      // CT Scan mappings
      { modality: 'CT', procedure_pattern: 'BRAIN', type: 'CT_Scan_Brain', typedr: 'CT_Scan_Brain', priority: 10 },
      { modality: 'CT', procedure_pattern: 'HRCT CHEST', type: 'CT_Scan_U/A_Chest_&_others', typedr: 'CT_Scan_U/A_Chest_&_others', priority: 10 },
      { modality: 'CT', procedure_pattern: 'CHEST', type: 'CT_Scan_U/A_Chest_&_others', typedr: 'CT_Scan_U/A_Chest_&_others', priority: 5 },
      { modality: 'CT', procedure_pattern: 'ABDOMEN', type: 'CT_Scan_U/A_Chest_&_others', typedr: 'CT_Scan_U/A_Chest_&_others', priority: 5 },
      { modality: 'CT', procedure_pattern: 'KUB', type: 'CT_Scan_U/A_Chest_&_others', typedr: 'CT_Scan_U/A_Chest_&_others', priority: 5 },
      { modality: 'CT', procedure_pattern: 'WHOLE SPINE', type: 'CT_Scan_U/A_Chest_&_others', typedr: 'CT_Scan_U/A_Chest_&_others', priority: 5 },
      { modality: 'CT', procedure_pattern: 'NECK', type: 'CT_Scan_U/A_Chest_&_others', typedr: 'CT_Scan_U/A_Chest_&_others', priority: 5 },
      { modality: 'CT', procedure_pattern: 'PNS', type: 'CT_Scan_U/A_Chest_&_others', typedr: 'CT_Scan_U/A_Chest_&_others', priority: 5 },
      { modality: 'CT', procedure_pattern: 'BONE WINDOW WITH 3D RECONSTRUCTION', type: 'CT_Scan_Brain', typedr: 'CT_Scan_Brain', priority: 8 },
      { modality: 'CT', procedure_pattern: 'ANGIO', type: 'CT Angiogram', typedr: 'CT Angiogram', priority: 10 },
      { modality: 'CT', procedure_pattern: 'CISTERN', type: 'CT Cisternography', typedr: 'CT Cisternography', priority: 10 },
      
      // MRI mappings
      { modality: 'MR', procedure_pattern: 'LUMBER SPINE', type: 'MRI_Brain/Lumbar/Cervical/Dorsal_spine', typedr: 'MRI_Brain/Lumbar/Cervical/Dorsal_spine', priority: 10 },
      { modality: 'MR', procedure_pattern: 'L-S SPINE', type: 'MRI_Brain/Lumbar/Cervical/Dorsal_spine', typedr: 'MRI_Brain/Lumbar/Cervical/Dorsal_spine', priority: 8 },
      { modality: 'MR', procedure_pattern: 'CERVICAL SPINE', type: 'MRI_Brain/Lumbar/Cervical/Dorsal_spine', typedr: 'MRI_Brain/Lumbar/Cervical/Dorsal_spine', priority: 10 },
      { modality: 'MR', procedure_pattern: 'C-SPINE', type: 'MRI_Brain/Lumbar/Cervical/Dorsal_spine', typedr: 'MRI_Brain/Lumbar/Cervical/Dorsal_spine', priority: 8 },
      { modality: 'MR', procedure_pattern: 'BRAIN', type: 'MRI_Brain/Lumbar/Cervical/Dorsal_spine', typedr: 'MRI_Brain/Lumbar/Cervical/Dorsal_spine', priority: 8 },
      { modality: 'MR', procedure_pattern: 'BRAIN MRI WITH ANGIO', type: 'MRI Angiogram', typedr: 'MRI Angiogram', priority: 10 },
      { modality: 'MR', procedure_pattern: 'MRI WITH SCREENING', type: 'MRI Brain/spine with Screening others part', typedr: 'MRI Brain/spine with Screening others part', priority: 10 },
      { modality: 'MR', procedure_pattern: 'WHOLE ABDOMEN', type: 'MRI of Whole Abdomen/KUB', typedr: 'MRI of Whole Abdomen/KUB', priority: 10 },
      { modality: 'MR', procedure_pattern: 'PELVIS', type: 'MRI / Pelvis / Upper Abdomen/Extremities', typedr: 'MRI / Pelvis / Upper Abdomen/Extremities', priority: 10 },
      { modality: 'MR', procedure_pattern: 'UPPER ABDOMEN', type: 'MRI / Pelvis / Upper Abdomen/Extremities', typedr: 'MRI / Pelvis / Upper Abdomen/Extremities', priority: 8 },
      { modality: 'MR', procedure_pattern: 'EXTREMITIES', type: 'MRI / Pelvis / Upper Abdomen/Extremities', typedr: 'MRI / Pelvis / Upper Abdomen/Extremities', priority: 5 },
      
      // X-Ray mappings
      { modality: 'CR', procedure_pattern: 'RT KNEE JOINT', type: 'X-Ray_B/V', typedr: 'X-Ray_Single_View', priority: 10 },
      { modality: 'CR', procedure_pattern: 'L-S SPINE B/V', type: 'X-Ray_B/V', typedr: 'X-Ray_Both_View', priority: 10 },
      { modality: 'CR', procedure_pattern: 'B/L HAND', type: 'X-Ray_B/V', typedr: 'X-Ray_Both_View', priority: 10 },
      { modality: 'CR', procedure_pattern: 'HAND B/V', type: 'X-Ray_B/V', typedr: 'X-Ray_Both_View', priority: 8 },
      { modality: 'CR', procedure_pattern: 'ANKLE B/V', type: 'X-Ray_B/V', typedr: 'X-Ray_Both_View', priority: 8 },
      { modality: 'CR', procedure_pattern: 'X-RAY CHEST PA VIEW', type: 'X-Ray_B/V', typedr: 'X-Ray_Single_View', priority: 10 },
      { modality: 'CR', procedure_pattern: 'X-RAY KUB', type: 'X-Ray_B/V', typedr: 'X-Ray_Single_View', priority: 8 },
      { modality: 'CR', procedure_pattern: 'X-RAY SKULL', type: 'X-Ray_B/V', typedr: 'X-Ray_Single_View', priority: 8 },
      { modality: 'CR', procedure_pattern: 'BONE AGE', type: 'Bone age', typedr: 'Bone age', priority: 10 },
      
      // Other modalities
      { modality: 'DR', procedure_pattern: 'CHEST', type: 'X-Ray_B/V', typedr: 'X-Ray_Single_View', priority: 5 },
      { modality: 'DX', procedure_pattern: 'BONE DENSITY', type: 'Bone age', typedr: 'Bone age', priority: 5 },
      { modality: 'ECG', procedure_pattern: 'ECG', type: 'ECG', typedr: 'ECG', priority: 10 },
      { modality: 'MG', procedure_pattern: 'MAMMO', type: 'Mammography Both View', typedr: 'Mammography Both View', priority: 10 }
    ];
    
    for (const mapping of sampleMappings) {
      try {
        // Check if mapping already exists
        const existing = await pool.query(
          'SELECT id FROM mappings WHERE modality = $1 AND procedure_pattern = $2',
          [mapping.modality, mapping.procedure_pattern]
        );
        
        if (existing.rows.length === 0) {
          await this.create(mapping);
        }
      } catch (e) {
        console.error('Error adding mapping:', e.message);
      }
    }
  }
}

export default Mapping;