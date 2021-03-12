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
                const values = builder.buildValuesLineForInsert(obj, oldArgumentsArr);
                await db.query(`insert into mainschema.${outputTable}_dimension(${argumentsLine}) values(${values})`);
            }

        }
    
    } else {

        for (const obj of rows) {

            const human = (Object.keys(obj).length > 1) ? 'laureate' : 'athlete';
            const name = (human === 'laureate') ? 'full_name' : 'athlete';

            const laureateInfoLine = genereratorAllData.getLaureateInfoColumns();
            const laureateInfoArr = laureateInfoLine.split(', ');

            const laureateInfoCondition = builder.buildConditionForSearchingCopy(laureateInfoArr, laureateInfoArr, obj);
            let copyLaureateInfoRows = await dataRecipient.getLaureateInfoCopy(laureateInfoCondition, human);

            if (human === 'laureate' && copyLaureateInfoRows.length === 0) {
                const values = builder.buildValuesLineForInsert(obj, laureateInfoArr);
                await db.query(`insert into mainschema.laureate_info(${laureateInfoLine}) values(${values})`);
                copyLaureateInfoRows = await dataRecipient.getLaureateInfoCopy(laureateInfoCondition, human);
            }

            const laureateInfoID = copyLaureateInfoRows[0]['laureate_info_id'];

            const copyHuman = await dataRecipient.getHumanCopy(obj, laureateInfoID);

            if (copyHuman.length === 0) {
                await db.query(`insert into mainschema.human_dimension(${argumentsLine}) values('${obj[name]}', ${laureateInfoID})`);
            }

        }
    }
    

};

module.exports = insertDataIntoTable;