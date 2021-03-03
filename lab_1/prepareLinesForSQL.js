"use strict";

const db = require('./db');

class LinesBuilder {
    
    constructor(tableName) {
        this.tableName = tableName;
    }

    createArgumentsLine(data) {
        const fields = Object.keys(data);

        let line = '';
        for (let index = 0; index < fields.length; index++) {
            line += fields[index].toLowerCase();
            if (index < fields.length - 1) {
                line += ', ';
            }
        }

        return line;
    }

    createValuesLine(data) {
        const validData = this.makeValidData(data);
        const keys = Object.keys(validData);

        let line = ``;
        for (let index = 0; index < keys.length; index++) {
            
            if (validData[keys[index]] === '') {
                line += null;

            } else {
                line += `'` + validData[keys[index]] + `'`;
            }

            if (index < keys.length - 1) {
                line += ', ';
            }
        }

        return line;
    }

    makeValidData(data) {
        for (const field in data) {            
            if (data[field].indexOf("'") > - 1) {
                data[field] = data[field].replace(/'/gi, "''");
            }
        }
        return data;
    }

}

module.exports = LinesBuilder;