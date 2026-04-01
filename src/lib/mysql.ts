import mysql from 'mysql2/promise';

// Configurações para o banco de dados MySQL na Hostinger
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // Geralmente 'localhost' na Hostinger
  user: process.env.DB_USER || 'u123456789_user',
  password: process.env.DB_PASSWORD || 'sua_senha_aqui',
  database: process.env.DB_NAME || 'u123456789_biolink',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
