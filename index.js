require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// MySQL bağlantısı
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// DB bağlantısını test et
connection.connect(err => {
  if (err) {
    console.error('❌ DB connection error:', err);
  } else {
    console.log('✅ Connected to MySQL RDS');
  }
});

// Health check endpoint (ALB için)
app.get('/health', (req, res) => {
  // Veritabanı bağlantısı kontrolü
  if (connection.state === 'disconnected') {
    return res.status(500).send('DB disconnected');
  }
  res.status(200).send('OK');
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('🚀 Fargate CI/CD test — new version deployed automatically! You can try carefully! Last');
});

// Users endpoint
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).send('DB error');
    }
    res.json(results);
  });
});

// Sunucu başlat
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
