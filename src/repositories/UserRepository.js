import pool from "../config/database.js";

class UserRepository {
  async create({ email, senha, tipo_pessoa }) {
    const query = `
      INSERT INTO users (email, senha, tipo_pessoa)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [email, senha, tipo_pessoa];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }
}

export default new UserRepository();