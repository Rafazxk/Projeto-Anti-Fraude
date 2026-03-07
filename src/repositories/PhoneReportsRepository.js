import pool from "../config/database.js";

class PhoneReportsRepository {
   
   async countReports(numero){
     
      const query = `SELECT COUNT(*) FROM telefones_reportados WHERE numero = $1`;
      
      const result = await pool.query(query, [numero]);
   
      return parseInt(result.rows[0].count);
   }
}
 export default new PhoneReportsRepository();