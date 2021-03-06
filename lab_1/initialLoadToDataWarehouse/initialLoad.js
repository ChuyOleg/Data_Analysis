"use strict";

const bd = require('../db');
const getRows = require('./getDistinctRowsFromDB');
const validData = require('./validData');

const initialLoad = async () => {

    const uniqueTime = await getRows('public.population', 'time');
    const uniqueCountries = await getRows('public.population', 'location');
    const genderArr = ['male', 'female', 'total'];
    
    const uniqueSports = await getRows('public.tournaments', 'sport');

    for (const obj of uniqueTime) {        
        
        const copyTime = await db.query(`select year from mainschema.time_dimension where year = ${obj['time']}`);
        
        if (copyTime.rows.length === 0) {
            await db.query(`insert into mainschema.time_dimension(year) values(${obj['time']})`)
        }

    };

    for (const obj of uniqueCountries) {

        const location = validData(obj['location']);

        const copyLocation = await db.query(`select location from mainschema.location_dimension where location like '${location}'`);

        if (copyLocation.rows.length === 0) {
            await db.query(`insert into mainschema.location_dimension(location) values('${location}')`);
        }

    }

    for (const gender of genderArr) {

        const copyGender = await db.query(`select gender from mainschema.gender_dimension where gender like '${gender}'`);

        if (copyGender.rows.length === 0) {
            await db.query(`insert into mainschema.gender_dimension(gender) values('${gender}')`);
        }

    }

    for (const obj of uniqueSports) {


        const uniqueDisciplines = await db.query(`select distinct(discipline) from public.tournaments where sport like '${obj['sport']}'`);
        const rowsDisc = uniqueDisciplines.rows;

        for (const objDisc of rowsDisc) {

            const uniqueEvents = await db.query(`select distinct(event) from public.tournaments where discipline like '${objDisc['discipline']}'`);
            const rowsEvent = uniqueEvents.rows;

            for (const objEvent of rowsEvent) {

                const copySport = await db.query(`select sport from mainschema.sport_dimension where sport like '${obj['sport']}' and discipline like '${objDisc['discipline']}' and event like '${objEvent['event']}'`);

                if (copySport.rows.length === 0) {
                    await db.query(`insert into mainschema.sport_dimension(sport, discipline, event) values('${obj['sport']}', '${objDisc['discipline']}', '${objEvent['event']}')`);
                }
            
            }

        }
        
    }
};

module.exports = initialLoad;