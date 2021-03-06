"use strict";

const db = require('../db');
const GeneratorAllData = require('./GeneratorAllData');

const genereratorAllData = new GeneratorAllData();

const insertDataIntoTable = async table => {
    
    let data;

    switch(table) {
        case 'time':
            data  = await genereratorAllData.getTimeData();
            break;
        case 'location':
            data = await genereratorAllData.getLocationData();
            break;
        case 'gender':
            data = await genereratorAllData.getGenderData();
            break;
        case 'sport':
            data = await genereratorAllData.getSportData();
            break;
        case 'medal':
            data = await genereratorAllData.getMedalData();
            break;
        case 'category':
            data = await genereratorAllData.getCategoryData();
            break;
        case 'organization':
            data = await genereratorAllData.getOrganizationData();
            break;
        case 'laureate_type':
            data = await genereratorAllData.getLaureateTypeData();
            break;
        case 'human':
            data = await genereratorAllData.getHumanData();
            break;
        default:
            throw new Error(`${table} isn't exist. Check arguments !`);
            break;
    }

    const rows = data[0];
    const argumentsLine = data[1];

    for (const obj of rows) {
        
        const copy = await db.query(`select year from mainschema.time_dimension where = ${obj['time']}`);

    }

};

module.exports = insertDataIntoTable;