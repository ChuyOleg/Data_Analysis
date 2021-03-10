"use strict";

const db = require('../db');

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
                const copyData = await db.query(`select location from mainschema.location_dimension where lower(location) like lower('${obj['country']}%')`);
                return copyData.rows;
            } else if (inputTable === 'nobel_laureates') {
                const copyData = await db.query(`select location from mainschema.location_dimension where lower(location) like lower('${obj['birth_country']}')`);
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
            const copyData = await db.query(`select * from mainschema.human_dimension where full_name like '${obj[name]}' and laureate_info_id is null`); 
            return copyData.rows;
        } else {
            const copyData = await db.query(`select * from mainschema.human_dimension where full_name like '${obj[name]}' and laureate_info_id = ${laureateInfoID}`); 
            return copyData.rows;
        }
    
    }

}

module.exports = DataRecipient;