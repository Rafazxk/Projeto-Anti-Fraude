import pool from "../config/database.js";

class BlacklistRepository {

async findAllDomains() {

  const query = `
  SELECT valor, motivo
  FROM blacklist
  WHERE tipo = 'dominio'
`;

  const { rows } = await pool.query(query);
   
  return rows;
}

}

export default new BlacklistRepository();