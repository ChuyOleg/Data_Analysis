"use strict";

const db = require('../db');

const DataRecipient = require('./DataRecipientFromDB');
const Validator = require('./Validator');

const dataRecipient = new DataRecipient();
const validator = new Validator();

const fillFactTable = async () => {

    const populationData = await dataRecipient.getInputTableData('population');
    const correctPopulationData = validator.validArrayOfObjects(populationData);
   
    const tournamentsData = await dataRecipient.getInputTableData('tournaments');
    const laureatesData = await dataRecipient.getInputTableData('nobel_laureates');

    for (const obj of populationData) {
        const genders = ['male', 'female', 'total'];
        const fact_type_1 = 'population';
        const fact_type_2 = 'pop_density';
        const location_id = await db.query(`select location_id from mainschema.location_dimension where location like '${obj['location']}'`);
        const time_id = await db.query(`select time_id from mainschema.time_dimension where year = ${obj['time']}`);

        if (time_id.rows[0] === undefined) {
            continue;
        }
 
        const population = {
            male: obj['popmale'],
            female: obj['popfemale'],
            total: obj['poptotal']
        }

        const density = obj['popdensity'];

        // for (const gender of genders) {
        //     const gender_id = await db.query(`select gender_id from mainschema.gender_dimension where gender like '${gender}'`);
        //     await db.query(`insert into mainschema.fact_table(
        //         time_id, location_id, gender_id, fact_type, population
        //     ) values(
        //         ${time_id.rows[0]['time_id']}, ${location_id.rows[0]['location_id']}, ${gender_id.rows[0]['gender_id']}, 'population', ${population[gender]} 
        //     )`);
        // }

        // await db.query(`insert into mainschema.fact_table(
        //     time_id, location_id, fact_type, pop_density
        // ) values(
        //     ${time_id.rows[0]['time_id']}, ${location_id.rows[0]['location_id']}, 'density', ${density}
        // )`);

    }

};

module.exports = fillFactTable;