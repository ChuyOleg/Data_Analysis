"use strict";

const db = require('../db');

const getRows = async (table, ...columns) => {
    
    const data = await db.query(`select distinct ${columns.join(', ')} from ${table}`);
    const rows = data.rows;
    return rows;

};

module.exports = getRows;