"use strict";

const db = require('../db');
const insertDataIntoTables = require('./insertDataIntoTables');

const initialLoad = async () => {

    // good
    //  await insertDataIntoTables('population', 'time');

    // good
    //  await insertDataIntoTables('tournaments', 'time');

    // good
    //  await insertDataIntoTables('nobel_laureates', 'time');

    // good
    // await insertDataIntoTables(null, 'gender');

    // good
    await insertDataIntoTables('tournaments', 'sport');

    // good
    // await insertDataIntoTables('tournaments', 'medal');

    // good
    // await insertDataIntoTables('nobel_laureates', 'category');

    // good
    // await insertDataIntoTables('nobel_laureates', 'organization');

    // good
    // await insertDataIntoTables('nobel_laureates', 'laureate_type');

    // good 
    // await insertDataIntoTables('population', 'location');

    // good
    // await insertDataIntoTables('tournaments', 'location');

    // good
    // await insertDataIntoTables('nobel_laureates', 'location');

    await insertDataIntoTables(null, 'human');
};

module.exports = initialLoad;