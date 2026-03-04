import db from "../config/database.js";

class ConsultaDetalhesRepository {
  async salvarDetalhe({ consulta_id, regra_ativada, pontuacao, mensagem, risco }) {
    const query = `
      INSERT INTO consulta_detalhes
      (consulta_id, regra_ativada, pontuacao, mensagem, risco)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [consulta_id, regra_ativada, pontuacao, mensagem, risco];
    const { rows } = await db.query(query, values);
    return rows[0];
  }
}

export default new ConsultaDetalhesRepository();