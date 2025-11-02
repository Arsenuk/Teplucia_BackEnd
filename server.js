import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();
const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) console.error('❌ DB error:', err);
  else console.log('✅ Connected to MySQL');
});

// Приклад маршруту
import userRoutes from './routes/userRoutes.js';
app.use('/api/users', userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});

export default db;
