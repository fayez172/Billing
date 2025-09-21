import pool from '../db/connection.js';

class Invoice {
  static async create(invoiceData) {
    const { client_id, period_start, period_end, subtotal, previous_due, total_due, status, created_by } = invoiceData;

    const query = `
      INSERT INTO invoices (client_id, period_start, period_end, subtotal, previous_due, total_due, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [client_id, period_start, period_end, subtotal, previous_due, total_due, status, created_by];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM invoices WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByClientAndPeriod(clientId, periodStart, periodEnd) {
    const query = `
      SELECT * FROM invoices 
      WHERE client_id = $1 AND period_start = $2 AND period_end = $3
    `;
    const result = await pool.query(query, [clientId, periodStart, periodEnd]);
    return result.rows[0];
  }

  static async findAllByClient(clientId) {
    const query = 'SELECT * FROM invoices WHERE client_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [clientId]);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE invoices 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async addLineItems(invoiceId, lineItems) {
    const query = `
      INSERT INTO invoice_lines (invoice_id, type, qty, price, total)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const results = [];
    for (const item of lineItems) {
      const values = [invoiceId, item.type, item.qty, item.price, item.total];
      const result = await pool.query(query, values);
      results.push(result.rows[0]);
    }
    return results;
  }

  static async getLineItems(invoiceId) {
    const query = 'SELECT * FROM invoice_lines WHERE invoice_id = $1 ORDER BY type';
    const result = await pool.query(query, [invoiceId]);
    return result.rows;
  }
}

export default Invoice;