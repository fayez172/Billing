import pool from '../db/connection.js';

class AuditLog {
  static async create(logData) {
    const { user_id, action, table_name, record_id, old_values, new_values } = logData;

    const query = `
      INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [user_id, action, table_name, record_id, old_values, new_values];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findByTable(table) {
    const query = 'SELECT * FROM audit_logs WHERE table_name = $1 ORDER BY created_at DESC LIMIT 100';
    const result = await pool.query(query, [table]);
    return result.rows;
  }

  static async findByAction(action) {
    const query = 'SELECT * FROM audit_logs WHERE action = $1 ORDER BY created_at DESC LIMIT 100';
    const result = await pool.query(query, [action]);
    return result.rows;
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM audit_logs WHERE 1=1';
    const values = [];
    let valueIndex = 1;

    if (filters.user_id) {
      query += ` AND user_id = $${valueIndex}`;
      values.push(filters.user_id);
      valueIndex++;
    }

    if (filters.action) {
      query += ` AND action = $${valueIndex}`;
      values.push(filters.action);
      valueIndex++;
    }

    if (filters.table_name) {
      query += ` AND table_name = $${valueIndex}`;
      values.push(filters.table_name);
      valueIndex++;
    }

    query += ' ORDER BY created_at DESC LIMIT 1000';

    const result = await pool.query(query, values);
    return result.rows;
  }
}

export default AuditLog;