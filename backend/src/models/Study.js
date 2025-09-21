import pool from '../db/connection.js';

class Study {
  static async create(studyData) {
    const {
      workflow_id,
      mrn,
      procedure_raw,
      report_comp_time,
      final_rad_name,
      modality,
      hospital_name,
      image_count,
      patient_name,
      type,
      typedr,
      mapped_by,
      mapping_confidence,
      parent_id
    } = studyData;

    const query = `
      INSERT INTO studies (
        workflow_id, mrn, procedure_raw, report_comp_time, final_rad_name,
        modality, hospital_name, image_count, patient_name, type, typedr,
        mapped_by, mapping_confidence, parent_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      workflow_id, mrn, procedure_raw, report_comp_time, final_rad_name,
      modality, hospital_name, image_count, patient_name, type, typedr,
      mapped_by, mapping_confidence, parent_id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByWorkflowId(workflowId) {
    const query = 'SELECT * FROM studies WHERE workflow_id = $1';
    const result = await pool.query(query, [workflowId]);
    return result.rows[0];
  }

  static async findAllUnmapped() {
    const query = 'SELECT * FROM studies WHERE type IS NULL ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async updateMapping(id, type, typedr, mappedBy, confidence) {
    const query = `
      UPDATE studies 
      SET type = $1, typedr = $2, mapped_by = $3, mapping_confidence = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `;
    const values = [type, typedr, mappedBy, confidence, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAllWithFilters(filters = {}) {
    let query = 'SELECT * FROM studies WHERE 1=1';
    const values = [];
    let valueIndex = 1;

    if (filters.hospital) {
      query += ` AND hospital_name = $${valueIndex}`;
      values.push(filters.hospital);
      valueIndex++;
    }

    if (filters.modality) {
      query += ` AND modality = $${valueIndex}`;
      values.push(filters.modality);
      valueIndex++;
    }

    if (filters.type) {
      query += ` AND type = $${valueIndex}`;
      values.push(filters.type);
      valueIndex++;
    }

    if (filters.dateFrom) {
      query += ` AND report_comp_time >= $${valueIndex}`;
      values.push(filters.dateFrom);
      valueIndex++;
    }

    if (filters.dateTo) {
      query += ` AND report_comp_time <= $${valueIndex}`;
      values.push(filters.dateTo);
      valueIndex++;
    }

    query += ' ORDER BY report_comp_time DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }
}

export default Study;