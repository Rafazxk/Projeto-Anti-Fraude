import pool from "../config/database.js"; 

class PrintRepository {
  
  // Busca por Hash
  async findByHash(id_hash) {
    const query = `
      SELECT * FROM prints_analisados 
      WHERE id_hash = $1
    `;
    const { rows } = await pool.query(query, [id_hash]);
    return rows[0];
  }


  async save(dados) {
    const { 
      id_hash, 
      consulta_id, 
      caminho_arquivo, 
      texto_extraido, 
      tipo_golpe, 
      score_risco 
    } = dados;

    const query = `
      INSERT INTO prints_analisados 
      (id_hash, consulta_id, caminho_arquivo, texto_extraido, tipo_golpe, score_risco)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [id_hash, consulta_id, caminho_arquivo, texto_extraido, tipo_golpe, score_risco];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

}

export default new PrintRepository();