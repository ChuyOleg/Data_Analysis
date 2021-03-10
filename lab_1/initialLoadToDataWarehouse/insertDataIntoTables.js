"use strict";

const db = require('../db');
const GeneratorAllData = require('./GeneratorAllData');
const Validator = require('./Validator');
const Builder = require('./Builder');

const genereratorAllData = new GeneratorAllData();
const validator = new Validator();
const builder = new Builder();

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

    if (outputTable != 'human' && outputTable != 'location') {
        
        for (const obj of rows) {

            const condition = builder.buildConditionForSearchingCopy(newArgumentsArr, oldArgumentsArr, obj);
    
            const copyData = await db.query(`select ${argumentsLine} from mainschema.${outputTable}_dimension ${condition}`);
            const copyRows = copyData.rows;

            if (copyRows.length === 0) {
                const values = builder.BuildValuesLineForInsert(obj, oldArgumentsArr);
                await db.query(`insert into mainschema.${outputTable}_dimension(${argumentsLine}) values(${values})`);
            }

            // let copy;
            // if (inputTable === 'tournaments' && outputTable === 'location') {
            //     copy = await db.query(`select location from mainschema.location_dimension where lower(location) like lower('${obj['country']}%')`);
            // } else if (inputTable === 'nobel_laureates' && outputTable === 'location') {
            //     copy  = await db.query(`select location from mainschema.location_dimension where lower(location) like lower('${obj['birth_country']}')`);
            // } else {
            //     copy = await db.query(`select ${argumentsLine} from mainschema.${outputTable}_dimension ${condition}`);
            // }
    
        }    
    } else {
        // for (const obj of rows) {

        //     for (const field in obj) {
        //         if (obj[field] != null) obj[field] = validator.validQuotes(obj[field]);
        //     }

        //     const human = (Object.keys(obj).length > 1) ? 'laureate' : 'athlete';
        //     const name = (human === 'laureate') ? 'full_name' : 'athlete';
        //     let condition = '';
        //     let copyLaureateInfo;
        //     if (human === 'laureate') {
        //         condition = `where birth_date like '${obj['birth_date']}'
        //             and birth_city like '${obj['birth_city']}'
        //             and birth_country like '${obj['birth_country']}'
        //             and death_date like '${obj['death_date']}'
        //             and death_city like '${obj['death_city']}'
        //             and death_country like '${obj['death_country']}'
        //         `;
        //         copyLaureateInfo = await db.query(`select laureate_info_id from mainschema.laureate_info ${condition}`);
        //     } else {
        //         copyLaureateInfo = {rows: [{ 'laureate_info_id': null }]}
        //     }


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
        //         await db.query(`insert into mainschema.human_dimension(full_name, laureate_info_id) values('${obj[name]}', ${laureateInfoID})`);
        //     }

        // }
    }
    

};

module.exports = insertDataIntoTable;