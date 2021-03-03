"use strict";

const db = require('./db');
const csv = require('csv-parser');
const fs = require('fs');
const LinesBuilder = require('./linesBuilderForSQL');

const loadData_CSV_FromSource = async (file, tableName) => {

    const tableNameLowerCase = tableName.toLowerCase();
    const linesBuilder = new LinesBuilder(tableNameLowerCase);

    let argumentsLine = null;

    fs.createReadStream(`text_files/${file}.csv`)
    .pipe(csv())
    .on('data', async data => {

        if (argumentsLine === null) {
            argumentsLine = linesBuilder.createArgumentsLine(data);
        }

        const valuesLine = linesBuilder.createValuesLine(data);

        await db.query(`insert into ${tableNameLowerCase}(${argumentsLine}) values(${valuesLine})`)
            .catch(err => console.log(valuesLine));
    })
    .on('end', () => {
        console.log('END')
    });
}

loadData_CSV_FromSource('summer', 'Tournaments');
loadData_CSV_FromSource('winter', 'Tournaments');
loadData_CSV_FromSource('WPP2019_TotalPopulationBySex', 'Population');