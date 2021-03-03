"use strict";
const express = require('express');
const db = require('./db');
const csv = require('csv-parser');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const app = express();

app.listen(PORT, () => console.log(`Server has been started on ${PORT}`));

app.get('/', async (req, res) => {
    const summerTournaments = await db.query("select * from summertournament");
    const data = summerTournaments.rows;
    console.log(data);
    res.send('Hello from VV.');
})
