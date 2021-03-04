"use strict";

const db = require('./db');
const xlsx = require('xlsx');
const LinesBuilder = require('./linesBuilderForSQL');

const loadData_XLSX_FromSource = async (file, tableName, sheet) => {

    const tableNameLowerCase = tableName.toLowerCase();
    const linesBuilder = new LinesBuilder(tableNameLowerCase);

    const wb = xlsx.readFile(`text_files/${file}.xlsx`);
    const ws = wb.Sheets[sheet];
    const allData = xlsx.utils.sheet_to_json(ws, {defval: ""});
     
    let argumentsLine = null;

    for (const data of allData) {

        if (argumentsLine === null) {
            argumentsLine = linesBuilder.createArgumentsLine(data);
        }

        const valuesLine = linesBuilder.createValuesLine(data);

        await db.query(`insert into ${tableNameLowerCase}(${argumentsLine}) values(${valuesLine})`)
            .catch(err => console.log(err));
    
    };
}

// no longer used
// loadData_XLSX_FromSource('World_Happiness', 'happiness', 'Data behind Table 2.1 WHR 2017');