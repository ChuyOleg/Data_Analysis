"use strict";

class Builder {

    buildConditionForSearchingCopy(newFieldNames, oldFieldNames, obj) {
        
        let condition;
        
        for (let index = 0; index < newFieldNames.length; index++) {

            const data = obj[oldFieldNames[index]];

            let equalizer = (newFieldNames[index] === 'year' || newFieldNames[index] === 'locid') ? `= ${data}` : `like '${data}'`;
            if (data === null) equalizer = `is ${data}`

            if (index === 0) {
                condition = `where ${newFieldNames[index]} ${equalizer}`;
            } else {
                condition += ` and ${newFieldNames[index]} ${equalizer}`;
            }
        
        }

        return condition;
    
    }

    buildValuesLineForInsert(data, fields) {
        let line = '';
        for (const field of fields) {
            const value = data[field];
            if (fields.indexOf(field) === 0) {
                if (value === null) {
                    line += null;
                } else {
                    line += `'${value}'`;
                }
            } else {
                if (value === null) {
                    line += ', ' + null;
                } else {
                    line += `, '${value}'`;
                }
            }
        }
        return line;
    }

    buildEqualizer(value) {
        if (value === null) return 'is null';
        return `like '${value}'`;
    }

};

module.exports = Builder;