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

    async hasNotCopyInFactTable(fact_type, info) {
        
        let data;

        if (fact_type === 'population') {
            
            const populationEqualizer = (info['population'] === null) ? 'is' : '=';

            data = await db.query(`select fact_id from mainschema.fact_table
                where time_id = ${info['time_id']}
                and location_id = ${info['location_id']}
                and gender_id = ${info['gender_id']}
                and population ${populationEqualizer} ${info['population']}
            `);

        } else if (fact_type === 'density') {

            data = await db.query(`select fact_id from mainschema.fact_table
                where time_id = ${info['time_id']}
                and location_id = ${info['location_id']}
                and pop_density = ${info['pop_density']}
            `);

        } else if (fact_type === 'win_tournament') {
            
            data = await db.query(`select fact_id from mainschema.fact_table
                where time_id = ${info['time_id']}
                and location_id = ${info['location_id']}
                and sport_id = ${info['sport_id']}
                and human_id = ${info['human_id']}
                and medal_id = ${info['medal_id']}
                and gender_id = ${info['gender_id']}
            `);

        } else if (fact_type === 'win_prize') {

            const genderEqualizer = (info['gender_id'] === 'null') ? 'is' : '=';

            data = await db.query(`select fact_id from mainschema.fact_table
                where time_id = ${info['time_id']}
                and location_id = ${info['location_id']}
                and gender_id ${genderEqualizer} ${info['gender_id']}
                and category_id = ${info['category_id']}
                and organization_id = ${info['organization_id']}
                and laureate_type_id = ${info['laureate_type_id']}
                and human_id = ${info['human_id']}
            `);

        } else {
            throw new Error('DataRecipientFromDB => hasNotCopyInFactTable incorrect fact_type!');
        }
    
        if (data.rows.length === 0) return true;
        return false;

    }

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
            const locationEq = builder.buildEqualizer(location);
            data = await db.query(`select location_id from mainschema.location_dimension where location ${locationEq}`);
        } else if (input_table === 'tournaments') {
            const locationEq = (location === null) ? 'is null': `like lower('${location}%')`;
            data = await db.query(`select location_id from mainschema.location_dimension where lower(location) ${locationEq}`);
        } else if (input_table === 'nobel_laureates') {
            const locationEq = (location === null) ? 'is null' : `like lower('${location}')`;
            data = await db.query(`select location_id from mainschema.location_dimension where lower(location) ${locationEq}`);
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
        const nameEq = builder.buildEqualizer(name);
        const cityEq = builder.buildEqualizer(city);
        const countryEq = builder.buildEqualizer(country);
        const data = await db.query(`select organization_id from mainschema.organization_dimension where organization_name ${nameEq} and organization_city ${cityEq} and organization_country ${countryEq}`);
        const organization_id = data.rows[0]['organization_id'];
        return organization_id;
    }

    async getLaureateTypeIDFromDim(type) {
        const data = await db.query(`select laureate_type_id from mainschema.laureate_type_dimension where laureate_type like '${type}'`)
        const laureate_type_id = data.rows[0]['laureate_type_id'];
        return laureate_type_id;
    }

    async getNobelLaureateInfoForInsert(obj) {

        const sexCondition = (obj['sex'] === null) ? 'is null' : `like lower('${obj['sex']}')`;
        const orgNameEqualizer = (obj['organization_name'] === null) ? 'is null' : `like '${obj['organization_name']}'`;
        const orgCityEqualizer = (obj['organization_city'] === null) ? 'is null' : `like '${obj['organization_city']}'`;
        const orgCountryEqualizer = (obj['organization_country'] === null) ? 'is null' : `like '${obj['organization_country']}'`;
        const locationEqualizer = (obj['birth_country'] === null) ? 'is null' : `like '${obj['birth_country']}'`;

        const data = await db.query(`
            select * from (
                (select time_id from mainschema.time_dimension where year = ${obj['year']}) as time
                cross join
                (select location_id from mainschema.location_dimension where location ${locationEqualizer}) as loc       
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