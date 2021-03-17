"use strict";

const DataRecipientFromDB = require('../DataRecipientFromDB');
const db = require('../../db');

const dataRecipient = new DataRecipientFromDB;

const fillFromTournaments = async (extraData) => {

    const tournamentsData = await dataRecipient.getInputTableData('tournaments');

    const fact_type = 'win_tournament';

    const genders_id = {
        'male': await dataRecipient.getGenderIDFromDIM('male'),
        'female': await dataRecipient.getGenderIDFromDIM('female'),
        'total': await dataRecipient.getGenderIDFromDIM('total')
    }

    const medals_id = {
        'Gold': await dataRecipient.getMedalIDFromDim('Gold'),
        'Silver': await dataRecipient.getMedalIDFromDim('Silver'),
        'Bronze': await dataRecipient.getMedalIDFromDim('Bronze')
    }

    for (const obj of tournamentsData) {

        const info = {
            'time_id': await dataRecipient.getTimeIDFromDIM(obj['year']),
            'location_id': await dataRecipient.getLocationIDFromDIM(obj['country'], 'tournaments'),
            'sport_id': await dataRecipient.getSportIDFromDim(obj['sport'], obj['discipline'], obj['event']),
            'human_id': await dataRecipient.getHumanIDFromDim(obj, 'tournaments'),
            'medal_id': medals_id[obj['medal']],
            'gender_id': (obj['gender'] === 'Men') ? genders_id['male'] : genders_id['female']
        }

        // check for a copy before inserting
        if (await dataRecipient.hasNotCopyInFactTable('win_tournament', info)) {
            
            await db.query(`insert into mainschema.fact_table(
                time_id, location_id, fact_type, gender_id, medal_id, sport_id, human_id, win_tournament
            ) values(
                ${info['time_id']}, ${info['location_id']}, '${fact_type}', ${info['gender_id']}, ${info['medal_id']}, ${info['sport_id']}, ${info['human_id']}, 'Yes'
            )`);
        
        }
    
    }

};

module.exports = fillFromTournaments;