"use strict";

const DataRecipientFromDB = require('../DataRecipientFromDB');
const db = require('../../db');

const dataRecipient = new DataRecipientFromDB;

const fillFromTournaments = async (extraData) => {

    const tournamentsData = await dataRecipient.getInputTableData('tournaments');

    const fact_type = 'win_tournament';

    for (const obj of tournamentsData) {

        const info = await dataRecipient.getTournamentInfoForInsert(obj);

        await db.query(`insert into mainschema.fact_table(
            time_id, location_id, fact_type, gender_id, medal_id, sport_id, human_id, win_tournament
        ) values(
            ${info['time_id']}, ${info['location_id']}, '${fact_type}', ${info['gender_id']}, ${info['medal_id']}, ${info['sport_id']}, ${info['human_id']}, 'Yes'
        )`);
        
    
    }

};

module.exports = fillFromTournaments;