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

        if (obj['time'] > 2020) {
            continue;
        }

        const population = {
            male: obj['popmale'],
            female: obj['popfemale'],
            total: obj['poptotal']
        }

        const info = {
            'time_id': await dataRecipient.getTimeIDFromDIM(obj['time']),
            'location_id': await dataRecipient.getLocationIDFromDIM(obj['location'], 'population'),
            'pop_density': obj['popdensity']
        };

        for (const gender of genders) {

            info['gender_id'] = genders_id[gender];
            info['population'] = population[gender];

            // check for a copy before inserting
            // if (await dataRecipient.hasNotCopyInFactTable('population', info)) {
                
                await db.query(`insert into mainschema.fact_table(
                    time_id, location_id, gender_id, fact_type, population
                ) values(
                    ${info['time_id']}, ${info['location_id']}, ${info['gender_id']}, '${fact_type_1}', ${info['population']}
                )`);

            // }
            
        }

        // check for a copy before inserting
        if (await dataRecipient.hasNotCopyInFactTable('density', info)) {
            
            await db.query(`insert into mainschema.fact_table(
                time_id, location_id, fact_type, pop_density
            ) values(
                ${info['time_id']}, ${info['location_id']}, '${fact_type_2}', ${info['pop_density']}
            )`);
        
        }
        

    }

};

module.exports = fillFromPopulation;