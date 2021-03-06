"use strict";

const express = require('express');
const initialLoad = require('./initialLoadToDataWarehouse/initialLoad');

const PORT = process.env.PORT || 8080;

const app = express();

app.listen(PORT, () => console.log(`Server has been started on ${PORT}`));

app.get('/', async (req, res) => {
    res.send('Hello from VV.');
});

(async () => {
    const data = await initialLoadPopulation();
    console.log('END');
})();