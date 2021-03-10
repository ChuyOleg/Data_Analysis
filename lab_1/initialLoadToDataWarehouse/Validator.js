"use strict";

class Validator {

    validQuotes(data) {
        if (data === null || typeof(data) != 'string') return data;
        return data.replace(/'/gi, "''");
    }

    validArrayOfObjects(arr) {
        
        for (const obj of arr) {
            for (const field in obj) {
                obj[field] = this.validQuotes(obj[field]);
            }
        }
        
        return arr;
    }

};


module.exports = Validator;