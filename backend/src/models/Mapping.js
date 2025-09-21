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
    // First try exact match
    let query = `
      SELECT * FROM mappings 
      WHERE modality = $1 AND procedure_pattern = $2
      ORDER BY priority DESC
      LIMIT 1
    `;
    
    let result = await pool.query(query, [modality, procedure]);
    if (result.rows.length > 0) {
      return { mapping: result.rows[0], confidence: 'exact' };
    }

    // Then try case-insensitive contains match
    query = `
      SELECT * FROM mappings 
      WHERE modality = $1 AND LOWER(procedure_pattern) = LOWER($2)
      ORDER BY priority DESC
      LIMIT 1
    `;
    
    result = await pool.query(query, [modality, procedure]);
    if (result.rows.length > 0) {
      return { mapping: result.rows[0], confidence: 'exact' };
    }

    // Then try pattern matching (contains)
    query = `
      SELECT * FROM mappings 
      WHERE modality = $1 AND $2 ILIKE '%' || procedure_pattern || '%'
      ORDER BY priority DESC
      LIMIT 1
    `;
    
    result = await pool.query(query, [modality, procedure]);
    if (result.rows.length > 0) {
      return { mapping: result.rows[0], confidence: 'fuzzy' };
    }

    // Finally try regex pattern matching
    query = `
      SELECT * FROM mappings 
      WHERE modality = $1 AND $2 ~* procedure_pattern
      ORDER BY priority DESC
      LIMIT 1
    `;
    
    result = await pool.query(query, [modality, procedure]);
    if (result.rows.length > 0) {
      return { mapping: result.rows[0], confidence: 'fuzzy' };
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
}

export default Mapping;