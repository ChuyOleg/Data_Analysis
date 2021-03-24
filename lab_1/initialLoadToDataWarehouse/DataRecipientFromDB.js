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
                const equalizer = (location === null) ? 'is null' : `like lower('${location}%')`;
                const copyData = await db.query(`select location from mainschema.location_dimension where lower(location) ${equalizer}`);
                return copyData.rows;
            } else if (inputTable === 'nobel_laureates') {
                const location = obj['birth_country'];
                const equalizer = (location === null) ? 'is null' : `like lower('${location}')`;
                const copyData = await db.query(`select location from mainschema.location_dimension where lower(location) ${equalizer}`);
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

    async getGenderIDFromDIM(gender) {
        const data = await db.query(`select gender_id from mainschema.gender_dimension where gender like '${gender}'`);
        const gender_id = data.rows[0]['gender_id'];
        return gender_id;
    }

    async getPopulationInfoForInsert(obj) {

        const locationEqualizer = (obj['location'] === null) ? 'is null' : `like '${obj['location']}'`;

        const data = await db.query(`
            select * from (
                (select time_id from mainschema.time_dimension where year = ${obj['time']}) as time
                cross join
                (select location_id from mainschema.location_dimension where location ${locationEqualizer}) as loc
            )
        `);

        return data.rows[0];
    }

    async getTournamentInfoForInsert(obj) {

        const locationEqualizer = (obj['country'] === null) ? 'is null': `like lower('${obj['country']}%')`;
        const gender = (obj['gender'] === 'Men') ? 'male' : 'female';

        const data = await db.query(`
            select * from (
                (select time_id from mainschema.time_dimension where year = ${obj['year']}) as time
                cross join
                (select location_id from mainschema.location_dimension where lower(location) ${locationEqualizer}) as loc
                cross join
                (select sport_id from mainschema.sport_dimension where
                    sport like '${obj['sport']}' and discipline like '${obj['discipline']}' and event like '${obj['event']}') as sport
                cross join
                (select human_id from mainschema.human_dimension where full_name like '${obj['athlete']}' and laureate_info_id is null) as hum
                cross join
                (select medal_id from mainschema.medal_dimension where medal like '${obj['medal']}') as medal
                cross join
                (select gender_id from mainschema.gender_dimension where gender like '${gender}') as gender
            )
        `);

        return data.rows[0];

    }

    async getNobelLaureateInfoForInsert(obj) {

        const sexCondition = (obj['sex'] === null) ? 'is null' : `like lower('${obj['sex']}')`;
        const orgNameEqualizer = (obj['organization_name'] === null) ? 'is null' : `like '${obj['organization_name']}'`;
        const orgCityEqualizer = (obj['organization_city'] === null) ? 'is null' : `like '${obj['organization_city']}'`;
        const orgCountryEqualizer = (obj['organization_country'] === null) ? 'is null' : `like '${obj['organization_country']}'`;
        const locationEqualizer = (obj['birth_country'] === null) ? 'is null' : `like lower('${obj['birth_country']}')`;

        const data = await db.query(`
            select * from (
                (select time_id from mainschema.time_dimension where year = ${obj['year']}) as time
                cross join
                (select location_id from mainschema.location_dimension where lower(location) ${locationEqualizer}) as loc       
                cross join
                (select gender_id from mainschema.gender_dimension where gender ${sexCondition}) as gen
                cross join
                (select category_id from mainschema.category_dimension where category like '${obj['category']}') as cat
                cross join
                (select organization_id from mainschema.organization_dimension where organization_name ${orgNameEqualizer} and organization_city ${orgCityEqualizer} and organization_country ${orgCountryEqualizer}) as org
                cross join
                (select laureate_type_id from mainschema.laureate_type_dimension where laureate_type like '${obj['laureate_type']}') as lType
                cross join
                (select human_id from mainschema.human_dimension where full_name like '${obj['full_name']}'
                    and laureate_info_id = (select laureate_info_id from mainschema.laureate_info
                        where birth_date ${builder.buildEqualizer(obj['birth_date'])}
                        and birth_city ${builder.buildEqualizer(obj['birth_city'])}
                        and birth_country ${builder.buildEqualizer(obj['birth_country'])}
                        and death_date ${builder.buildEqualizer(obj['death_date'])}
                        and death_city ${builder.buildEqualizer(obj['death_city'])}
                        and death_country ${builder.buildEqualizer(obj['death_country'])})) as human 
                )`
        );
        return data.rows[0];
    }

}

module.exports = DataRecipient;