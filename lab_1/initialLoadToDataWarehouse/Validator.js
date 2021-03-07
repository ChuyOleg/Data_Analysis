"use strict";

class Validator {

    validQuotes(data) {
        return data.replace(/'/gi, "''");
    }

    createValuesLine(data, fields) {
        let line = '';
        for (const field of fields) {
            if (fields.indexOf(field) === 0) {
                line += `'${data[field]}'`;
            } else {
                line += `, '${data[field]}'`;
            }
        }
        return line;
    }

};


module.exports = Validator;