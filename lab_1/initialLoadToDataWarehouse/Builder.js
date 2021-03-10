"use strict";

const Validator = require('./Validator');

const validator = new Validator();

class Builder {

    buildConditionForSearchingCopy(newFieldNames, oldFieldNames, obj) {
        
        let condition;
        
        for (let index = 0; index < newFieldNames.length; index++) {

            const data = validator.validQuotes(obj[oldFieldNames[index]]);

            const equalizer = (newFieldNames[index] === 'year') ? '=' : 'like';

            if (index === 0) {
                condition = `where ${newFieldNames[index]} ${equalizer} '${data}'`;
            } else {
                condition += ` and ${newFieldNames[index]} ${equalizer} '${data}'`;
            }
        
        }

        return condition;
    
    }

    BuildValuesLineForInsert(data, fields) {
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

module.exports = Builder;