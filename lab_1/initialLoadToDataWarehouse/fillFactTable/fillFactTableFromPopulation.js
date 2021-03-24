"use strict";

const DataRecipientFromDB = require('../DataRecipientFromDB');
const db = require('../../db');

const dataRecipient = new DataRecipientFromDB;

const fillFromPopulation = async () => {

    const populationData = await dataRecipient.getInputTableData('population');

    const fact_type_1 = 'population';
    const fact_type_2 = 'pop_density';

    const genders_id = {
        'male': await dataRecipient.getGenderIDFromDIM('male'),
        'female': await dataRecipient.getGenderIDFromDIM('female'),
        'total': await dataRecipient.getGenderIDFromDIM('total'),
        'null': 'null',
    }

    const genders = ['male', 'female', 'total'];

    for (const obj of populationData) {

        const info = await dataRecipient.getPopulationInfoForInsert(obj);

        const population = {
            male: obj['popmale'],
            female: obj['popfemale'],
            total: obj['poptotal']
        }

        for (const gender of genders) {

            info['gender_id'] = genders_id[gender];
            info['population'] = population[gender];
            
            await db.query(`insert into mainschema.fact_table(
                time_id, location_id, gender_id, fact_type, population
            ) values(
                ${info['time_id']}, ${info['location_id']}, ${info['gender_id']}, '${fact_type_1}', ${info['population']}
            )`);
            
        }

        info['pop_density'] = obj['popdensity'];

        await db.query(`insert into mainschema.fact_table(
            time_id, location_id, fact_type, pop_density
        ) values(
            ${info['time_id']}, ${info['location_id']}, '${fact_type_2}', ${info['pop_density']}
        )`);
    
    }

};

module.exports = fillFromPopulation;