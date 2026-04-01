import pkg from "pg";
import dotenv from "dotenv";

import { setupDatabase } from './initDb.js';

setupDatabase();
dotenv.config();

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL não encontrada nas variáveis de ambiente");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ADICIONE ISSO AQUI:
  ssl: {
    rejectUnauthorized: false 
  }
});

// Teste de conexão com tratamento de erro melhorado
try {
  const client = await pool.connect();
  console.log("--- [BANCO] Conexão estabelecida com sucesso no Render! ---");
  client.release();  
} catch (err) {
  console.error("--- [ERRO BANCO] Falha ao conectar: ---");
  console.error(err.message);
}

export default pool;