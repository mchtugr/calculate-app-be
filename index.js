const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
var cors = require('cors')
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(cors())

const pool = new Pool({
    connectionString: process.env.DB_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

app.get('/', (req, res) => {

    res.json({
        message: 'Welcome to the backend!'
    });
});


app.post('/add', async (req, res) => {
    const { first, second } = req.body;
    const sum = first + second;
    try {
        // await pool.query('INSERT INTO calculations (a, b, sum) VALUES ($1, $2, $3)', [ a, b, sum ]);
        res.json({ sum });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error storing result');
    }
});

app.listen(port, () => {
    console.log(`Backend listening on port ${ port }`);
});