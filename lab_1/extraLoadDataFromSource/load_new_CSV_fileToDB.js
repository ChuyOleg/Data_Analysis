"use strict";

const db = require('../db');
const csv = require('csv-parser');
const fs = require('fs');
const LinesBuilder = require('../initialLoadDataFromSource/linesBuilderForSQL');
const hasNotCopy = require('./checkCopy');

const linesBuilder = new LinesBuilder();

const asyncFunc = async (data, argumentsLine, table) => {
    
    const valuesLine = linesBuilder.createValuesLine(data);

    if (await hasNotCopy(data, table)) {
        await db.query(`insert into public.${table}(${argumentsLine}) values(${valuesLine})`)
            .catch(err => {
                console.log(data);
                console.log(err);
                process.exit(0);
            });
    }


}

const loadNewData_CSV_FromSource = async (file, tableName) => {

    const tableNameLowerCase = tableName.toLowerCase();

    let argumentsLine = null;

    await new Promise((resolve, reject) => {
        
        const promises = [];
        fs.createReadStream(`../text_files/${file}.csv`)
        .pipe(csv())
        .on('data', async data => {

            if (argumentsLine === null) {
                argumentsLine = linesBuilder.createArgumentsLine(data);
            }
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
    console.time('loading new data');
    // await loadNewData_CSV_FromSource('population_new_for_insert', 'Population');
    // await loadNewData_CSV_FromSource('nobel_laureates_new', 'nobel_laureates');

    // await loadNewData_CSV_FromSource('population_new_for_update', 'Population');
    console.timeEnd('loading new data');
})();