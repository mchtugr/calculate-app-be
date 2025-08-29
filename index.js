const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');

dotenv.config();

const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(cors())

const useSsl = process.env.DB_SSL === 'true';
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: useSsl ? {
      ca: fs.readFileSync(__dirname + '/certs/eu-north-1-bundle.pem').toString(),
      rejectUnauthorized: false,
    } : false,
});

async function initDb() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS calculations (
      id SERIAL PRIMARY KEY,
      number1 INTEGER,
      number2 INTEGER,
      result INTEGER
    );
  `);
    console.log("Database schema initialized");
}

initDb().catch(console.error);

app.get('/', (req, res) => {

    res.json({
        message: 'Welcome to the backend!'
    });
});


app.post('/add', async (req, res) => {
    const { first, second } = req.body;
    const number1 = parseInt(first);
    const number2 = parseInt(second);
    const result = first + second;
    try {
        await pool.query('INSERT INTO calculations (number1, number2, result) VALUES ($1, $2, $3)', [ number1, number2, result ]);
        res.json({ sum: result });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error storing result');
    }
});

app.listen(port, () => {
    console.log(`Backend listening on port ${ port }`);
});