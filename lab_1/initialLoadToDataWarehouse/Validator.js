"use strict";

class Validator {

    validQuotes(data) {
        if (data === null || typeof(data) === 'string') return data;
        return data.replace(/'/gi, "''");
    }

};


module.exports = Validator;