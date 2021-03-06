"use strict";

const validData = data => {
    return data.replace(/'/gi, "''");
}

module.exports = validData;