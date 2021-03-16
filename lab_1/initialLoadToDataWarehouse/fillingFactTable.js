"use strict";

const db = require('../db');

const fillFromPopulation = require('./fillFactTable/fillFactTableFromPopulation');
const fillFromTournaments = require('./fillFactTable/fillFactTableFromTournaments');

const fillFactTable = async () => {

    // await fillFromPopulation();
    await fillFromTournaments();
    // await fromFromNobelLaureates();

};

module.exports = fillFactTable;