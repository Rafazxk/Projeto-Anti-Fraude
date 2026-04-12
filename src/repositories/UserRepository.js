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

   async findById(userId) {
  console.log("DEBUG: Buscando ID exatamente:", userId);
  
  
  const result = await pool.query('SELECT user_id FROM users WHERE user_id = $1::uuid', [userId]);
  

  if (result.rowCount === 0) {
    const allUsers = await pool.query('SELECT user_id FROM users');
    console.log("DEBUG: IDs disponíveis no banco:", allUsers.rows.map(r => r.user_id));
  }
  
  return result.rows[0];
}

  async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }
  
    async updatePlan(userId, novoPlano) {
        const query = `
            UPDATE users 
            SET plano = $1 
            WHERE user_id = $2
        `;
        
        await pool.query(query, [novoPlano, userId]);
    }
}

export default new UserRepository();