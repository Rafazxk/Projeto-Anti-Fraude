import pool from "../config/database.js"

class BlacklistRepository{

async findByDomain(domain) {
  const query = `
    SELECT valor, motivo
    FROM blacklist
    WHERE tipo = 'dominio'
    AND ($1 = valor OR $1 LIKE '%.' || valor)
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [domain]);
  return rows[0];
 }
}

export default  new BlacklistRepository();