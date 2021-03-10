"use strict";

const db = require('../db');
const GeneratorAllData = require('./GeneratorAllData');
const Builder = require('./Builder');
const DataRecipient = require('./DataRecipientFromDB');
const Validator = require('./Validator');

const genereratorAllData = new GeneratorAllData();
const builder = new Builder();
const validator = new Validator();
const dataRecipient = new DataRecipient();

const insertDataIntoTable = async (inputTable, outputTable) => {
    
    let data;

    switch(outputTable) {
        case 'time':
            data  = await genereratorAllData.getTimeData(inputTable);
            break;
        case 'location':
            data = await genereratorAllData.getLocationData(inputTable);
            break;
        case 'gender':
            data = genereratorAllData.getGenderData();
            break;
        case 'sport':
            data = await genereratorAllData.getSportData();
            break;
        case 'medal':
            data = await genereratorAllData.getMedalData();
            break;
        case 'category':
            data = await genereratorAllData.getCategoryData();
            break;
        case 'organization':
            data = await genereratorAllData.getOrganizationData();
            break;
        case 'laureate_type':
            data = await genereratorAllData.getLaureateTypeData();
            break;
        case 'human':
            data = await genereratorAllData.getHumanData();
            break;
        default:
            throw new Error(`${outputTable} isn't exist. Check arguments !`);
    }

    const rows = validator.validArrayOfObjects(data[0]);
    const argumentsLine = data[1];
    const newArgumentsArr = argumentsLine.split(', ');
    const oldArgumentsArr = data[2] || newArgumentsArr;

    if (outputTable != 'human') {
        
        for (const obj of rows) {

            const condition = builder.buildConditionForSearchingCopy(newArgumentsArr, oldArgumentsArr, obj);
    
            const copyRows = await dataRecipient.getCopy(inputTable, outputTable, argumentsLine, condition, obj);

            if (copyRows.length === 0) {
                const values = builder.BuildValuesLineForInsert(obj, oldArgumentsArr);
                await db.query(`insert into mainschema.${outputTable}_dimension(${argumentsLine}) values(${values})`);
            }

        }
    
    } else {
        for (const obj of rows) {

            const human = (Object.keys(obj).length > 1) ? 'laureate' : 'athlete';
            const name = (human === 'laureate') ? 'full_name' : 'athlete';

            if (human === 'athlete') continue;

            const laureateInfoLine = genereratorAllData.getLaureateInfoColumns();
            const laureateInfoArr = laureateInfoLine.split(', ');

            const laureateInfoCondition = builder.buildConditionForSearchingCopy(laureateInfoArr, laureateInfoArr, obj);
            const copyLaureateInfoRows = await dataRecipient.getLaureateInfoCopy(laureateInfoCondition, human);

        //     if (human === 'laureate' && copyLaureateInfo.rows.length === 0) {
        //         await db.query(`insert into mainschema.laureate_info(birth_date, birth_city, birth_country, death_date, death_city, death_country) 
        //             values('${obj['birth_date']}', '${obj['birth_city']}', '${obj['birth_country']}', '${obj['death_date']}', '${obj['death_city']}', '${obj['death_country']}')
        //         `);
        //         copyLaureateInfo = await db.query(`select laureate_info_id from mainschema.laureate_info ${condition}`);
        //     };

        //     const laureateInfoID = copyLaureateInfo.rows[0]['laureate_info_id'];

        //     let copyHuman;
        //     if (human === 'athlete') {
        //         copyHuman = await db.query(`select * from mainschema.human_dimension where full_name like '${obj[name]}' and laureate_info_id is null`); 
        //     } else {
        //         copyHuman = await db.query(`select * from mainschema.human_dimension where full_name like '${obj[name]}' and laureate_info_id = ${laureateInfoID}`); 
        //     }

        //     if (copyHuman.rows.length === 0) {
        //         await db.quexry(`insert into mainschema.human_dimension(full_name, laureate_info_id) values('${obj[name]}', ${laureateInfoID})`);
        //     }

        }
    }
    

};

module.exports = insertDataIntoTable;