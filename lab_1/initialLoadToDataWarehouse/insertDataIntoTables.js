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

    if (outputTable != 'human') {
        for (const obj of rows) {

            let condition = 'where';
            for (let index = 0; index < newArgumentsArr.length; index++) {
                const equalizer = (newArgumentsArr[index] === 'year' || newArgumentsArr[index] === 'laureate_info_id') ? '=' : 'like';
                if (index === 0) {
                    if (obj[oldArgumentsArr[index]] != null && typeof(obj[oldArgumentsArr[index]]) === 'string') {
                        obj[oldArgumentsArr[index]] = validator.validQuotes(obj[oldArgumentsArr[index]]);
                    }
                    condition += ` ${newArgumentsArr[index]} ${equalizer} '${obj[oldArgumentsArr[index]]}'`;
                } else {
                    condition += ` and ${newArgumentsArr[index]} ${equalizer} '${obj[oldArgumentsArr[index]]}'`;
                }
            }
    
            let copy;
            if (inputTable === 'tournaments' && outputTable === 'location') {
                copy = await db.query(`select location from mainschema.location_dimension where lower(location) like lower('${obj['country']}%')`);
            } else if (inputTable === 'nobel_laureates' && outputTable === 'location') {
                copy  = await db.query(`select location from mainschema.location_dimension where lower(location) like lower('${obj['birth_country']}')`);
            } else {
                copy = await db.query(`select ${argumentsLine} from mainschema.${outputTable}_dimension ${condition}`);
            }
    
            if (copy.rows.length === 0) {
                const values = validator.createValuesLine(obj, oldArgumentsArr);
                // await db.query(`insert into mainschema.${outputTable}_dimension(${argumentsLine}) values(${values})`);
            }
    
        }    
    } else {
        for (const obj of rows) {
            for (const field in obj) {
                if (obj[field] != null) obj[field] = validator.validQuotes(obj[field]);
            }
            let condition = '';
            if (Object.keys(obj).length > 1) {
                condition = `where birth_date like '${obj['birth_date']}'
                    and birth_city like '${obj['birth_city']}'
                    and birth_country like '${obj['birth_country']}'
                    and death_date like '${obj['death_date']}'
                    and death_city like '${obj['death_city']}'
                    and death_country like '${obj['death_country']}'
                `;
            }

            const copyLaureateInfo = await db.query(`select * from mainschema.laureate_info ${condition}`);

        }
    }
    

};

module.exports = insertDataIntoTable;