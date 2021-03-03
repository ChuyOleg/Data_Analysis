"use strict";

const db = require('./db');
const xlsx = require('xlsx');
const LinesBuilder = require('./prepareLinesForSQL');

const wb = xlsx.readFile('text_files/World_Happiness.xlsx');

const ws = wb.Sheets["Data behind Table 2.1 WHR 2017"];

const data = xlsx.utils.sheet_to_json(ws);

console.log(data[0]);

for (const field in data[0]) {
    data[0] = data[0].toLowerCase();
}

console.log(data[0]);