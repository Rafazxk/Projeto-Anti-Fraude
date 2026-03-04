import db from "../config/database.js";

class BlacklistRepository {

async findByDomain(dominio) {

  const query = `
  SELECT *
  FROM blacklist
  WHERE LOWER(TRIM(tipo)) = 'dominio'
  AND LOWER(TRIM(valor)) = LOWER(TRIM($1))
  LIMIT 1
`;

  const { rows } = await db.query(query, [dominio]);
   
   console.log("buscando dominio: ", dominio)
   
  return rows[0] || null;
}

}

export default new BlacklistRepository();