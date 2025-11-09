import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

try {
  const [rows] = await db.query("SELECT 1");
  console.log("✅ Connected to MySQL (Promise API)");
} catch (err) {
  console.error("❌ MySQL connection error:", err);
}


export default db;

