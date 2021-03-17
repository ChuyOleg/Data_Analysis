"use strict";

const DataRecipientFromDB = require('../DataRecipientFromDB');
const db = require('../../db');

const dataRecipient = new DataRecipientFromDB;

const fillFromNobelLaureates = async (extraData) => {

    const nobelData = await dataRecipient.getInputTableData('nobel_laureates');

    const fact_type = 'win_prize';

    // const genders_id = {
    //     'Male': await dataRecipient.getGenderIDFromDIM('male'),
    //     'Female': await dataRecipient.getGenderIDFromDIM('female'),
    //     'null': 'null'
    // }

    // const laureate_types = {
    //     'Individual': await dataRecipient.getLaureateTypeIDFromDim('Individual'),
    //     'Organization': await dataRecipient.getLaureateTypeIDFromDim('Organization')
    // }

    for (const obj of nobelData) {

        const info = await dataRecipient.getNobelLaureateInfoForInsert(obj);

        // const info = {
        //     'time_id': await dataRecipient.getTimeIDFromDIM(obj['year']),
        //     'location_id': await dataRecipient.getLocationIDFromDIM(obj['birth_country'], 'nobel_laureates'),
        //     'gender_id': genders_id[obj['sex']],
        //     'category_id': await dataRecipient.getCategoryIDFromDim(obj['category']),
        //     'organization_id': await dataRecipient.getOrganizationIDFromDim(obj['organization_name'], obj['organization_city'], obj['organization_country']),
        //     'laureate_type_id': laureate_types[obj['laureate_type']],
        //     'human_id': await dataRecipient.getHumanIDFromDim(obj, 'nobel_laureates')
        // }  

        // // check for a copy before inserting
        if (await dataRecipient.hasNotCopyInFactTable('win_prize', info)) {
            
            await db.query(`insert into mainschema.fact_table(
                time_id, location_id, fact_type, gender_id, category_id, organization_id, laureate_type_id, human_id, win_prize
            ) values(
                ${info['time_id']}, ${info['location_id']}, '${fact_type}', ${info['gender_id']}, ${info['category_id']}, ${info['organization_id']}, ${info['laureate_type_id']}, ${info['human_id']}, 'Yes'
            )`);
        
        }

    }

};

module.exports = fillFromNobelLaureates;