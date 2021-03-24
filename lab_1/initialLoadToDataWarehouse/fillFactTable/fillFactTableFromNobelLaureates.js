"use strict";

const DataRecipientFromDB = require('../DataRecipientFromDB');
const db = require('../../db');

const dataRecipient = new DataRecipientFromDB;

const fillFromNobelLaureates = async (extraData) => {

    const nobelData = await dataRecipient.getInputTableData('nobel_laureates');

    const fact_type = 'win_prize';

    for (const obj of nobelData) {

        const info = await dataRecipient.getNobelLaureateInfoForInsert(obj);

        await db.query(`insert into mainschema.fact_table(
            time_id, location_id, fact_type, gender_id, category_id, organization_id, laureate_type_id, human_id, win_prize
        ) values(
            ${info['time_id']}, ${info['location_id']}, '${fact_type}', ${info['gender_id']}, ${info['category_id']}, ${info['organization_id']}, ${info['laureate_type_id']}, ${info['human_id']}, 'Yes'
        )`);

    }

};

module.exports = fillFromNobelLaureates;