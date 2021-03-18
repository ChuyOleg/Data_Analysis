"use strict";

const db = require('../db');
const csv = require('csv-parser');
const fs = require('fs');
const LinesBuilder = require('./linesBuilderForSQL');

const loadData_CSV_FromSource = async (file, tableName) => {

    const tableNameLowerCase = tableName.toLowerCase();
    const linesBuilder = new LinesBuilder();

    let argumentsLine = null;

    await fs.createReadStream(`../text_files/${file}.csv`)
    .pipe(csv())
    .on('data', async data => {

        if (argumentsLine === null) {
            argumentsLine = linesBuilder.createArgumentsLine(data);
        }

        const valuesLine = linesBuilder.createValuesLine(data);

        await db.query(`insert into public.${tableNameLowerCase}(${argumentsLine}) values(${valuesLine})`)
            .catch(err => console.log(err));

        })
    .on('end', () => {
        console.log('END')
    });
}

const Validator = require('../initialLoadToDataWarehouse/Validator');
const validator = new Validator();
(async () => {

    // await loadData_CSV_FromSource('summer', 'Tournaments');
    // await loadData_CSV_FromSource('winter', 'Tournaments');
    // await loadData_CSV_FromSource('WPP2019_TotalPopulationBySex', 'Population');
    // await loadData_CSV_FromSource('nobel_laureates', 'nobel_laureates');

    // await loadData_CSV_FromSource('population_new_for_insert', 'Population');
    // await loadData_CSV_FromSource('nobel_laureates_new', 'nobel_laureates');

    // await loadData_CSV_FromSource('population_new_for_update', 'Population');

})();
