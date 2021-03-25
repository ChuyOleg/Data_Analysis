"use strict";

const db = require('../db');
const LinesBuilder = require('../initialLoadDataFromSource/linesBuilderForSQL');
const linesBuilder = new LinesBuilder();


const hasNotCopy = async(data, table) => {

    if (table === 'population') {
        
        const popMaleCond = (data['PopMale'] === '') ? 'is null' : `= ${data['PopMale']}`;
        const popFemaleCond = (data['PopFemale'] === '') ? 'is null' : `= ${data['PopFemale']}`;

        const dataDB = await db.query(`
            select * from public.population
            where locid = ${data['LocID']}
            and location like '${data['Location']}'
            and varid = ${data['VarID']}
            and variant like '${data['Variant']}'
            and midperiod = ${data['MidPeriod']}
            and popmale ${popMaleCond}
            and popfemale ${popFemaleCond}
            and poptotal = ${data['PopTotal']}
            and popdensity = ${data['PopDensity']}
        `).catch(err => {
            console.log('extraLoadDataFromSource => population');
            console.log(data);
            process.exit(0);
        }) 

        if (dataDB.rows.length === 0) return true;

    }

    if (table === 'tournaments') {
        
        const dataDB  = await db.query(`
            select * from public.tournaments
            where year = ${data['Year']}
            and city like '${data['City']}'
            and sport like '${data['Sport']}'
            and discipline like '${data['Discipline']}'
            and athlete like '${data['Athlete']}'
            and country like '${data['Country']}'
            and gender like '${data['Gender']}'
            and event like '${data['Event']}'
            and medal like '${data['Medal']}'

        `).catch(err => {
            console.log('extraLoadDataFromSource => tournaments');
            console.log(data);
            process.exit(0);
        })
    
        if (dataDB.rows.length === 0) return true;        

    }

    if (table === 'nobel_laureates') {
        
        const dataDB = await db.query(`
            select * from public.nobel_laureates
            where year = ${data['Year']}
            and category like '${data['Category']}'
            and prize like '${data['Prize']}'
            and motivation like '${data['Motivation']}'
            and prize_share like '${data['Prize Share']}'
            and laureate_id = ${data['Laureate ID']}
            and laureate_type like '${data['Laureate Type']}'
            and full_name like '${data['Full Name']}'
            and birth_date like '${data['Birth Date']}'
            and birth_city like '${data['Birth City']}'
            and birth_country like '${data['Birth Country']}'
            and sex like '${data['Sex']}'
            and organization_name like '${data['Organization Name']}'
            and organization_city like '${data['Organization City']}'
            and organization_country like '${data['Organization Country']}'
            and death_date like '${data['Death Date']}'
            and death_city like '${data['Death City']}'
            and death_country like '${data['Death Country']}'
        `).catch(err => {
            console.log('extraLoadDataFromSource => nobel_laureates');
            console.log(data);
            process.exit(0);
        }) 

        if (dataDB.rows.length === 0) return true;
    }

    return false;

}

module.exports = hasNotCopy;