"use strict";
const express = require('express');
const db = require('./db');
const csv = require('csv-parser');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const app = express();

app.listen(PORT, () => console.log(`Server has been started on ${PORT}`));

app.get('/', async (req, res) => {
    res.send('Hello from VV.');
})

const initialLoadPopulation = async () => {
    
    const newTime = await db.query('select distinct(time) from public.population');
    const newLocation = await db.query('select distinct(location) from public.population');
    
    const newTimeRows = newTime.rows;
    const newLocationRows = newLocation.rows;

    const oldTime = await db.query('select distinct(year) from mainschema.time_dimension');
    const oldLocation = await db.query('select distinct(country) from mainschema.country_dimension');
    
    const oldTimeRows = oldTime.rows;
    const oldLocationRows = oldLocation.rows;

    for (const obj of newTimeRows) {        
        
        const copyTime = await db.query(`select year from mainschema.time_dimension where year = ${obj['time']}`);
        
        if (copyTime.rows.length === 0) {
            await db.query(`insert into mainschema.time_dimension(year) values(${obj['time']})`)
        }

    };

    for (const obj of newLocationRows) {

        const copyLocation = await db.query(`select country from mainschema.country_dimension where country like '${obj['country']}'`);

        // fix this loop!!!
        // if (copyLocation.rows.length === 0) {
        //     console.log(obj['location']);
        //     await db.query(`insert into mainschema.country_dimension(country) values('${obj['location']}')`);
        // }

    }
}

(async () => {
    const data = await initialLoadPopulation();
    console.log('END');
})();