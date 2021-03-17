"use strict";

const DataRecipientFromDB = require('../DataRecipientFromDB');
const db = require('../../db');

const dataRecipient = new DataRecipientFromDB;

const fillFromNobelLaureates = async (extraData) => {

    const nobelData = await dataRecipient.getInputTableData('nobel_laureates');

    const fact_type = 'win_prize';

    const genders_id = {
        'Male': await dataRecipient.getGenderIDFromDIM('male'),
        'Female': await dataRecipient.getGenderIDFromDIM('female'),
        'null': 'null'
    }

    const laureate_types = {
        'Individual': await dataRecipient.getLaureateTypeIDFromDim('Individual'),
        'Organization': await dataRecipient.getLaureateTypeIDFromDim('Organization')
    }

    for (const obj of nobelData) {

        const time_id = await dataRecipient.getTimeIDFromDIM(obj['year']);
        const location_id = await dataRecipient.getLocationIDFromDIM(obj['birth_country'], 'nobel_laureates');
        const gender_id = genders_id[obj['sex']];
        const category_id = await dataRecipient.getCategoryIDFromDim(obj['category']);
        const organization_id = await dataRecipient.getOrganizationIDFromDim(obj['organization_name'], obj['organization_city'], obj['organization_country']);
        const laureate_type_id = laureate_types[obj['laureate_type']];
        const human_id = await dataRecipient.getHumanIDFromDim(obj, 'nobel_laureates');

        // CHECK FOR COPY
        await db.query(`insert into mainschema.fact_table(
            time_id, location_id, fact_type, gender_id, category_id, organization_id, laureate_type_id, human_id, win_prize
        ) values(
            ${time_id}, ${location_id}, '${fact_type}', ${gender_id}, ${category_id}, ${organization_id}, ${laureate_type_id}, ${human_id}, 'Yes'
        )`);

    }

};

module.exports = fillFromNobelLaureates;