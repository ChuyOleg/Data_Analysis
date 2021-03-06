"use strict";

const db = require('../db');
const validData = require('./validData');
const insertDataIntoTables = require('./insertDataIntoTables');

const initialLoad = async () => {



    await insertDataIntoTables('sport');


    // for (const obj of uniqueTime) {        
        
    //     const copyTime = await db.query(`select year from mainschema.time_dimension where year = ${obj['time']}`);
        
    //     if (copyTime.rows.length === 0) {
    //         await db.query(`insert into mainschema.time_dimension(year) values(${obj['time']})`)
    //     }

    // };

    // for (const obj of uniqueCountries) {

    //     const location = validData(obj['location']);

    //     const copyLocation = await db.query(`select location from mainschema.location_dimension where location like '${location}'`);

    //     if (copyLocation.rows.length === 0) {
    //         await db.query(`insert into mainschema.location_dimension(location) values('${location}')`);
    //     }

    // }

    // for (const gender of genderArr) {

    //     const copyGender = await db.query(`select gender from mainschema.gender_dimension where gender like '${gender}'`);

    //     if (copyGender.rows.length === 0) {
    //         await db.query(`insert into mainschema.gender_dimension(gender) values('${gender}')`);
    //     }

    // }
};

module.exports = initialLoad;