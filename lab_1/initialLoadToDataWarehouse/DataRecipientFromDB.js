"use strict";

const db = require('../db');
const Validator = require('./Validator');
const Builder = require('./Builder');
const ExtraData = require('./ExtraData');

const validator = new Validator();
const builder = new Builder();
const extraData = new ExtraData();

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

    async getLocationIDFromDIM(location, input_table) {
        let data;
        if (input_table === 'population') {
            data = await db.query(`select location_id from mainschema.location_dimension where location like '${location}'`);
        } else if (input_table === 'tournaments') {
            data = await db.query(`select location_id from mainschema.location_dimension where lower(location) like lower('${location}%')`);
        } else if (input_table === 'nobel_laureates') {
            data = await db.query(`select location_id from mainschema.location_dimension where lower(location) like lower('${location}')`);
        } else {
            throw new Error('DataRecipientFromDB => getLocationIDFromDIm incorrect input_table');
        }
        const location_id = data.rows[0]['location_id'];
        return location_id;
    }

    async getGenderIDFromDIM(gender) {
        const data = await db.query(`select gender_id from mainschema.gender_dimension where gender like '${gender}'`);
        const gender_id = data.rows[0]['gender_id'];
        return gender_id;
    }

    async getMedalIDFromDim(medal) {
        const data = await db.query(`select medal_id from mainschema.medal_dimension where medal like '${medal}'`);
        const medal_id = data.rows[0]['medal_id'];
        return medal_id;
    }

    async getSportIDFromDim(sport, discipline, event) {
        const data = await db.query(`select sport_id from mainschema.sport_dimension where sport like '${sport}' and discipline like '${discipline}' and event like '${event}'`)
        const sport_id = data.rows[0]['sport_id'];
        return sport_id;
    }

    async getLaureateInfoID(obj) {
        const argumentsArr = extraData.dimColumns['laureate_info'];
        const laureateInfoCondition = builder.buildConditionForSearchingCopy(argumentsArr, argumentsArr, obj);
        let laureateInfoID = await this.getLaureateInfoCopy(laureateInfoCondition, obj);
        return laureateInfoID[0]['laureate_info_id'];
    }

    async getHumanIDFromDim(human, input_table) {
        let data;
        if (input_table === 'tournaments') {
            data = await db.query(`select * from mainschema.human_dimension where full_name like '${human['athlete']}' and laureate_info_id is null`);
        } else if (input_table === 'nobel_laureates') {
            const laureateInfoID = await this.getLaureateInfoID(human);
            data = await db.query(`select * from mainschema.human_dimension where full_name like '${human['full_name']}' and laureate_info_id = ${laureateInfoID}`);
        } else {
            throw new Error('DataRecipientFromDB => getHumanIDFromDim incorrect input_table');
        }
        const human_id = data.rows[0]['human_id'];
        return human_id;
    }

    async getCategoryIDFromDim(category) {
        const data = await db.query(`select category_id from mainschema.category_dimension where category like '${category}'`);
        const category_id = data.rows[0]['category_id'];
        return category_id;
    }

    async getOrganizationIDFromDim(name, city, country) {
        const data = await db.query(`select organization_id from mainschema.organization_dimension where organization_name like '${name}' and organization_city like '${city}' and organization_country like '${country}'`);
        const organization_id = data.rows[0]['organization_id'];
        return organization_id;
    }

    async getLaureateTypeIDFromDim(type) {
        const data = await db.query(`select laureate_type_id from mainschema.laureate_type_dimension where laureate_type like '${type}'`)
        const laureate_type_id = data.rows[0]['laureate_type_id'];
        return laureate_type_id;
    }

}

module.exports = DataRecipient;