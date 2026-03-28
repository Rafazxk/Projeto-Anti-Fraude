import pool from "../config/database.js"; 

class PrintRepository {
  
  // Busca por Hash (Alta Performance)
  async findByHash(id_hash) {
    const query = `
      SELECT * FROM prints_analisados 
      WHERE id_hash = $1
    `;
    const { rows } = await pool.query(query, [id_hash]);
    return rows[0];
  }

  // Salva o resultado conforme suas colunas reais
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

  // Cria o registro na tabela 'consultas' para o histórico
  async criarConsulta(userId) {
    const query = `
      INSERT INTO consultas (user_id,
      tipo_consulta, data_consulta) 
      VALUES ($1, $2, CURRENT_TIMESTAMP) 
      RETURNING consulta_id
    `;
    const values = [userId, 'print'];
    
    const { rows } = await pool.query(query, values);
    return rows[0].consulta_id;
  }
}

export default new PrintRepository();