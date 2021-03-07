"use strict";

const db = require('../db');
const GeneratorAllData = require('./GeneratorAllData');
const Validator = require('./Validator');

const genereratorAllData = new GeneratorAllData();
const validator = new Validator();

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
            break;
    }

    const rows = data[0];
    const argumentsLine = data[1];
    const newArgumentsArr = argumentsLine.split(', ');
    const oldArgumentsArr = data[2] || newArgumentsArr;
    
    for (const obj of rows) {

        let condition = 'where';
        for (let index = 0; index < newArgumentsArr.length; index++) {
            const equalizer = (newArgumentsArr[index] === 'year' || newArgumentsArr[index] === 'laureate_info_id') ? '=' : 'like';
            if (index === 0) {
                condition += ` ${newArgumentsArr[index]} ${equalizer} '${obj[oldArgumentsArr[index]]}'`;
            } else {
                condition += `, ${newArgumentsArr[index]} ${equalizer} '${obj[oldArgumentsArr[index]]}'`;
            }
        }

        const copy = await db.query(`select ${argumentsLine} from mainschema.${outputTable}_dimension ${condition}`);

        if (copy.rows.length === 0) {
            const values = validator.createValuesLine(obj, oldArgumentsArr);
            await db.query(`insert into mainschema.${outputTable}_dimension(${argumentsLine}) values(${values})`);
        }

    }

};

module.exports = insertDataIntoTable;