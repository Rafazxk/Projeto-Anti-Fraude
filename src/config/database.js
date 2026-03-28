import pkg from "pg";
import dotenv from "dotenv";

//startar
//pg_ctl -D $PREFIX/var/lib/postgresql start
// psql -d guardix

dotenv.config();

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL não encontrada no .env");
  process.exit(1);
}

// console.log("database url: ", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL

});

try{
const client = await pool.connect();
console.log("conectou no banco")


client.release();  
} catch(err){
  console.error(err);
}
export default pool;