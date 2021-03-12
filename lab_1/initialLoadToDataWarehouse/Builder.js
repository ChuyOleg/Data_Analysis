"use strict";

class Builder {

    buildConditionForSearchingCopy(newFieldNames, oldFieldNames, obj) {
        
        let condition;
        
        for (let index = 0; index < newFieldNames.length; index++) {

            const data = obj[oldFieldNames[index]];

            const equalizer = (newFieldNames[index] === 'year') ? '=' : 'like';

            if (index === 0) {
                condition = `where ${newFieldNames[index]} ${equalizer} '${data}'`;
            } else {
                condition += ` and ${newFieldNames[index]} ${equalizer} '${data}'`;
            }
        
        }

        return condition;
    
    }

    buildValuesLineForInsert(data, fields) {
        let line = '';
        for (const field of fields) {
            const value = data[field];
            if (fields.indexOf(field) === 0) {
                line += `'${value}'`;
            } else {
                line += `, '${value}'`;
            }
        }
        return line;
    }

};

module.exports = Builder;