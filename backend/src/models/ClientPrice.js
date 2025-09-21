import pool from '../db/connection.js';

class ClientPrice {
  static async create(priceData) {
    const { client_id, type, price_taka, effective_from, effective_to } = priceData;

    const query = `
      INSERT INTO client_prices (client_id, type, price_taka, effective_from, effective_to)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [client_id, type, price_taka, effective_from, effective_to];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByClientId(clientId) {
    const query = 'SELECT * FROM client_prices WHERE client_id = $1 ORDER BY type, effective_from DESC';
    const result = await pool.query(query, [clientId]);
    return result.rows;
  }

  static async findByClientAndType(clientId, type) {
    const query = 'SELECT * FROM client_prices WHERE client_id = $1 AND type = $2 ORDER BY effective_from DESC';
    const result = await pool.query(query, [clientId, type]);
    return result.rows;
  }

  static async findActivePrice(clientId, type, date) {
    const query = `
      SELECT * 
      FROM client_prices 
      WHERE client_id = $1 
      AND type = $2 
      AND effective_from <= $3 
      AND (effective_to IS NULL OR effective_to >= $3)
      ORDER BY effective_from DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [clientId, type, date]);
    return result.rows[0];
  }

  static async update(id, priceData) {
    const { client_id, type, price_taka, effective_from, effective_to } = priceData;

    const query = `
      UPDATE client_prices 
      SET client_id = $1, type = $2, price_taka = $3, effective_from = $4, effective_to = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;

    const values = [client_id, type, price_taka, effective_from, effective_to, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

export default ClientPrice;