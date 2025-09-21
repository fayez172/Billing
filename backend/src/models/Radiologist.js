import pool from '../db/connection.js';

class Radiologist {
  static async create(radiologistData) {
    const { name, email, active } = radiologistData;

    const query = `
      INSERT INTO radiologists (name, email, active)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [name, email, active];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM radiologists WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByName(name) {
    const query = 'SELECT * FROM radiologists WHERE name = $1';
    const result = await pool.query(query, [name]);
    return result.rows;
  }

  static async findAll() {
    const query = 'SELECT * FROM radiologists ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  }

  static async update(id, radiologistData) {
    const { name, email, active } = radiologistData;

    const query = `
      UPDATE radiologists 
      SET name = $1, email = $2, active = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;

    const values = [name, email, active, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getFeeForType(radiologistId, typedr, date) {
    const query = `
      SELECT fee 
      FROM radiologist_prices 
      WHERE radiologist_id = $1 
      AND typedr = $2 
      AND effective_from <= $3 
      AND (effective_to IS NULL OR effective_to >= $3)
      ORDER BY effective_from DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [radiologistId, typedr, date]);
    return result.rows[0]?.fee || null;
  }
  
  static async addFee(radiologistId, typedr, fee, effectiveFrom, effectiveTo = null) {
    const query = `
      INSERT INTO radiologist_prices (radiologist_id, typedr, fee, effective_from, effective_to)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [radiologistId, typedr, fee, effectiveFrom, effectiveTo];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async bulkImportFees(radiologistId, fees) {
    const radiologist = await this.findById(radiologistId);
    if (!radiologist) {
      throw new Error('Radiologist not found');
    }
    
    const insertedFees = [];
    for (const [typedr, fee] of Object.entries(fees)) {
      if (fee !== null && fee !== undefined && fee !== '') {
        try {
          const feeRecord = await this.addFee(
            radiologistId, 
            typedr, 
            parseFloat(fee), 
            new Date(), 
            null
          );
          insertedFees.push(feeRecord);
        } catch (error) {
          console.error(`Error importing fee for ${typedr}:`, error.message);
        }
      }
    }
    
    return insertedFees;
  }
}

export default Radiologist;