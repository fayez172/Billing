import pool from '../db/connection.js';

class RadiologistPrice {
  static async create(priceData) {
    const { radiologist_id, typedr, fee, effective_from, effective_to } = priceData;

    const query = `
      INSERT INTO radiologist_prices (radiologist_id, typedr, fee, effective_from, effective_to)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [radiologist_id, typedr, fee, effective_from, effective_to];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByRadiologistId(radiologistId) {
    const query = 'SELECT * FROM radiologist_prices WHERE radiologist_id = $1 ORDER BY typedr, effective_from DESC';
    const result = await pool.query(query, [radiologistId]);
    return result.rows;
  }

  static async findByRadiologistAndType(radiologistId, typedr) {
    const query = 'SELECT * FROM radiologist_prices WHERE radiologist_id = $1 AND typedr = $2 ORDER BY effective_from DESC';
    const result = await pool.query(query, [radiologistId, typedr]);
    return result.rows;
  }

  static async findActiveFee(radiologistId, typedr, date) {
    const query = `
      SELECT * 
      FROM radiologist_prices 
      WHERE radiologist_id = $1 
      AND typedr = $2 
      AND effective_from <= $3 
      AND (effective_to IS NULL OR effective_to >= $3)
      ORDER BY effective_from DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [radiologistId, typedr, date]);
    return result.rows[0];
  }

  static async update(id, priceData) {
    const { radiologist_id, typedr, fee, effective_from, effective_to } = priceData;

    const query = `
      UPDATE radiologist_prices 
      SET radiologist_id = $1, typedr = $2, fee = $3, effective_from = $4, effective_to = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;

    const values = [radiologist_id, typedr, fee, effective_from, effective_to, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

export default RadiologistPrice;