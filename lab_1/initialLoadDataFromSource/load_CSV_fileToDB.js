"use strict";

const db = require('../db');
const csv = require('csv-parser');
const fs = require('fs');
const LinesBuilder = require('./linesBuilderForSQL');

const linesBuilder = new LinesBuilder();


const asyncFunc = async (data, argumentsLine, table) => {
    
    const valuesLine = linesBuilder.createValuesLine(data);

    await db.query(`insert into public.${table}(${argumentsLine}) values(${valuesLine})`)
        .catch(err => {
            console.log(data);
            console.log(err);
            process.exit(0);
        });

}

const loadData_CSV_FromSource = async (file, tableName) => {

    const tableNameLowerCase = tableName.toLowerCase();

    let argumentsLine = null;

    await new Promise((resolve, reject) => {
        
        const promises = [];
        fs.createReadStream(`../text_files/${file}.csv`)
        .pipe(csv())
        .on('data', async data => {

            if (tableNameLowerCase === 'population' && data['Time'] > 2019) return;

            if (argumentsLine === null) {
                argumentsLine = linesBuilder.createArgumentsLine(data);
            }

            const valuesLine = linesBuilder.createValuesLine(data);
            promises.push(asyncFunc(data, argumentsLine, tableNameLowerCase));

        })
        .on('end', async () => {
            await Promise.all(promises);
            console.log(`Initial load in public.${tableNameLowerCase} has done!`);
            resolve();
        });
    });
}

(async () => {
    console.time('loading from sources');
    // await loadData_CSV_FromSource('summer', 'Tournaments');
    // await loadData_CSV_FromSource('winter', 'Tournaments');
    // await loadData_CSV_FromSource('WPP2019_TotalPopulationBySex', 'Population');
    // await loadData_CSV_FromSource('nobel_laureates', 'nobel_laureates');
    console.timeEnd('loading from sources');
    // await loadData_CSV_FromSource('population_new_for_insert', 'Population');
    // await loadData_CSV_FromSource('nobel_laureates_new', 'nobel_laureates');

    // await loadData_CSV_FromSource('population_new_for_update', 'Population');

})();
