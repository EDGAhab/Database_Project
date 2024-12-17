const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'Feilian990725', // Replace with your MySQL password
  database: 'finance_track', // Replace with your database name
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

app.get('/', (req, res) => {
  res.send('Backend server is running.');
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

app.get('/users', (req, res) => {
    const query = 'SELECT * FROM Users';
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(results);
      }
    });
  });
  