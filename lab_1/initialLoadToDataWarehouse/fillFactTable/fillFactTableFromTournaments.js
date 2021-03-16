"use strict";

const DataRecipientFromDB = require('../DataRecipientFromDB');
const db = require('../../db');

const dataRecipient = new DataRecipientFromDB;

const fillFromTournaments = async () => {

    const tournamentsData = await dataRecipient.getInputTableData('tournaments');

    const fact_type = 'win_tournament';

    const genders_id = {
        'male': await dataRecipient.getGenderIDFromDIM('male'),
        'female': await dataRecipient.getGenderIDFromDIM('female'),
        'total': await dataRecipient.getGenderIDFromDIM('total')
    }

    for (const obj of tournamentsData) {

        await dataRecipient.getSimpleIDFromDim('time', obj);
        // const location_id = await dataRecipient.getLocationIDFromDIM(obj['country']);
        // const time_id = await dataRecipient.getTimeIDFromDIM(obj['year']);

    }

    // const yearData = await db.query(`select * from mainschema.time_dimension`);
    // const locationData = await db.query(`select * from mainschema.location_dimension`);
    // const sportData = await db.query(`select * from mainschema.sport_dimension`);
    // const athleteData = await db.query(`select * from mainschema.human_dimension`);
    // const genderData = await db.query(`select * from mainschema.gender_dimension`);
    // const medalData = await db.query(`select * from mainschema.medal_dimension`);

    // console.log(locationData.rows[0]);
    // console.log(sportData.rows[0]);
    // console.log(athleteData.rows[0]);
    // console.log(genderData.rows[0]);
    // console.log(medalData.rows[0]);


};

module.exports = fillFromTournaments;