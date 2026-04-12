import pkg from "pg";
import dotenv from "dotenv";


dotenv.config();

const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
  ssl: isProduction ? { rejectUnauthorized: false } : false
});


pool.on('connect', () => {
  console.log(`--- [BANCO] Conectado ao banco: ${isProduction ? 'PRODUÇÃO' : 'LOCAL/DESENVOLVIMENTO'} ---`);
});

pool.on('error', (err) => {
  console.error('--- [ERRO BANCO] Erro inesperado no pool:', err.message);
});

export default pool;