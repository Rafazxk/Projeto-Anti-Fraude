import pool from "../config/database.js";
import ConsultaDetalhesRepository from "./ConsultaDetalhesRepository.js";
 
class ConsultaRepository {
 async create({ user_id, tipo_consulta, score_risco, resultado }) {
    const query = `
      INSERT INTO consultas 
      (user_id, tipo_consulta, score_risco, resultado, data_consulta)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *; 
    `;
    const values = [user_id, tipo_consulta, score_risco, resultado];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findAllByUser(user_id) {
  const query = `
    SELECT *
    FROM consultas
    WHERE user_id = $1::uuid  -- O "::uuid" garante a comparação correta
    ORDER BY data_consulta DESC;
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
}

  async salvarDetalhes(detalhes) {
    return await ConsultaDetalhesRepository.salvarDetalhe(detalhes);
  }
}

export default new ConsultaRepository();