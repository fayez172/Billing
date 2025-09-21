import pool from '../db/connection.js';

class Client {
  static async create(clientData) {
    const { name, external_serial, billing_terms, active } = clientData;

    const query = `
      INSERT INTO clients (name, external_serial, billing_terms, active)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [name, external_serial, billing_terms, active];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM clients WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByName(name) {
    const query = 'SELECT * FROM clients WHERE name = $1';
    const result = await pool.query(query, [name]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM clients ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  }

  static async update(id, clientData) {
    const { name, external_serial, billing_terms, active } = clientData;

    const query = `
      UPDATE clients 
      SET name = $1, external_serial = $2, billing_terms = $3, active = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `;

    const values = [name, external_serial, billing_terms, active, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getPriceForType(clientId, type, date) {
    const query = `
      SELECT price_taka 
      FROM client_prices 
      WHERE client_id = $1 
      AND type = $2 
      AND effective_from <= $3 
      AND (effective_to IS NULL OR effective_to >= $3)
      ORDER BY effective_from DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [clientId, type, date]);
    return result.rows[0]?.price_taka || null;
  }
}

export default Client;