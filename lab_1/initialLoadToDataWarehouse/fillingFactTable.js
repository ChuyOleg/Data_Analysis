"use strict";

const db = require('../db');

const fillFromPopulation = require('./fillFactTable/fillFactTableFromPopulation');
const fillFromTournaments = require('./fillFactTable/fillFactTableFromTournaments');
const fillFromNobelLaureates = require('./fillFactTable/fillFactTableFromNobelLaureates');

const fillFactTable = async () => {

    await fillFromPopulation();
    await fillFromTournaments();
    await fillFromNobelLaureates();

};

module.exports = fillFactTable;