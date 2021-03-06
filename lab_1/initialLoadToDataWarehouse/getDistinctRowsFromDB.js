"use strict";

const db = require('../db');

const getRows = async (table, column) => {
    
    const data = await db.query(`select distinct(${column}) from ${table}`);
    const rows = data.rows;
    return rows;

};

module.exports = getRows;