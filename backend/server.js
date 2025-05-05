// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import MySQL connection
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Example route
app.get('/', (req, res) => {
  res.send('Freelance Help API is running');
});

// Example route using the DB
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users'; // Change to your actual table name
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
