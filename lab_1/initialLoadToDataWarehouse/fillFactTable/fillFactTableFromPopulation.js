"use strict";

const DataRecipientFromDB = require('../DataRecipientFromDB');
const db = require('../../db');

const dataRecipient = new DataRecipientFromDB;

const fillFromPopulation = async () => {

    const populationData = await dataRecipient.getInputTableData('population');

    // const laureatesData = await dataRecipient.getInputTableData('nobel_laureates');

    const fact_type_1 = 'population';
    const fact_type_2 = 'pop_density';

    const genders_id = {
        'male': await dataRecipient.getGenderIDFromDIM('male'),
        'female': await dataRecipient.getGenderIDFromDIM('female'),
        'total': await dataRecipient.getGenderIDFromDIM('total')
    }

    const genders = ['male', 'female', 'total'];

    for (const obj of populationData) {

        if (obj['time'] > 2020) {
            continue;
        }

        const density = obj['popdensity'];
        const population = {
            male: obj['popmale'],
            female: obj['popfemale'],
            total: obj['poptotal']
        }

        const location_id = await dataRecipient.getLocationIDFromDIM(obj['location'], 'population');
        const time_id = await dataRecipient.getTimeIDFromDIM(obj['time']);

        for (const gender of genders) {
            await db.query(`insert into mainschema.fact_table(
                time_id, location_id, gender_id, fact_type, population
            ) values(
                ${time_id}, ${location_id}, ${genders_id[gender]}, 'population', ${population[gender]} 
            )`);
        }

        // CHECK FOR COPY
        await db.query(`insert into mainschema.fact_table(
            time_id, location_id, fact_type, pop_density
        ) values(
            ${time_id}, ${location_id}, 'density', ${density}
        )`);

    }

};

module.exports = fillFromPopulation;