"use strict";

const db = require('../db');
const Validator = require('./Validator');
const Builder = require('./Builder');

const validator = new Validator();
const builder = new Builder();

class DataRecipient {

    async getRows(table, ...columns) {
        
        const data = await db.query(`select distinct ${columns.join(', ')} from ${table}`);
        const rows = data.rows;
        return rows;
    
    };

    async getCopy(inputTable, outputTable, argumentsLine, condition, obj) {
        
        if (outputTable != 'human' && outputTable != 'location') {
            
            const dataCopy = await db.query(`select ${argumentsLine} from mainschema.${outputTable}_dimension ${condition}`);
            return dataCopy.rows;
        
        } else if (outputTable === 'location') {
            if (inputTable === 'population') {
                const copyData = await db.query(`select ${argumentsLine} from mainschema.${outputTable}_dimension ${condition}`);
                return copyData.rows;
            } else if (inputTable === 'tournaments') {
                const location = obj['country'];
                const copyData = await db.query(`select location from mainschema.location_dimension where lower(location) like lower('${location}%')`);
                return copyData.rows;
            } else if (inputTable === 'nobel_laureates') {
                const location = obj['birth_country'];
                const copyData = await db.query(`select location from mainschema.location_dimension where lower(location) like lower('${location}')`);
                return copyData.rows;
            } else {
                throw new Error('Incorrect name of the input_table in the inserting into location_dimension. Check arguments!');
            }
        
        }
         
    };

    async getHumanCopy(obj, laureateInfoID) {
        
        const human = (Object.keys(obj).length > 1) ? 'laureate' : 'athlete';
        const name = (human === 'laureate') ? 'full_name' : 'athlete';
            
        if (human === 'athlete') {
            const full_name = obj[name];
            const copyData = await db.query(`select * from mainschema.human_dimension where full_name like '${full_name}' and laureate_info_id is null`); 
            return copyData.rows;
        } else {
            const full_name = obj[name];
            const copyData = await db.query(`select * from mainschema.human_dimension where full_name like '${full_name}' and laureate_info_id = ${laureateInfoID}`); 
            return copyData.rows;
        }
    
    }

    async getLaureateInfoCopy(condition, human) {
        if (human === 'athlete') return [{ 'laureate_info_id': null }];
        const copyLaureateInfo = await db.query(`select laureate_info_id from mainschema.laureate_info ${condition}`);
        return copyLaureateInfo.rows;
    }

    async getInputTableData(table) {
        const data = await db.query(`select * from public.${table}`);
        const validData = validator.validArrayOfObjects(data.rows);
        return validData;
    }

    async getTimeIDFromDIM(year) {
        const data = await db.query(`select time_id from mainschema.time_dimension where year = ${year}`);
        const time_id = data.rows[0]['time_id'];
        return time_id;
    }

    async getLocationIDFromDIM(location) {
        // think about different inputTables
        const data = await db.query(`select location_id from mainschema.location_dimension where location like '${location}'`);
        const location_id = data.rows[0]['location_id'];
        return location_id;
    }

    async getGenderIDFromDIM(gender) {
        const data = await db.query(`select gender_id from mainschema.gender_dimension where gender like '${gender}'`);
        const gender_id = data.rows[0]['gender_id'];
        return gender_id;
    }

    async getSimpleIDFromDim(dimName, obj) {
        const fields = Object.keys(obj);
        console.log(fields);
        // const condition = builder.buildConditionForSearchingCopy();
    }

}

module.exports = DataRecipient;