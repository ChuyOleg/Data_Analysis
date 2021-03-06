"use strict";

class Validator {

    async validQuotes(data) {
        return data.replace(/'/gi, "''");
    }

};


module.exports = Validator;