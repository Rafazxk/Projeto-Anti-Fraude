import pool from "../config/database.js";

class PhoneReportsRepository {
  async countReports(numero) {
  // O DISTINCT aqui garante que não contemos a mesma linha duas vezes se houver erro de join
  const query = `SELECT COALESCE(SUM(denuncias), 0) AS total FROM telefones_reportados WHERE numero = $1`;
  const result = await pool.query(query, [numero]);
  return parseInt(result.rows[0].total);
}
}
 export default new PhoneReportsRepository();