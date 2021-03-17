"use strict";

const db = require('../db');

const fillFromPopulation = require('./fillFactTable/fillFactTableFromPopulation');
const fillFromTournaments = require('./fillFactTable/fillFactTableFromTournaments');
const fillFromNobelLaureates = require('./fillFactTable/fillFactTableFromNobelLaureates');

const fillFactTable = async (extraData) => {

    await fillFromPopulation(extraData);
    console.log('Population is done');
    await fillFromTournaments(extraData);
    console.log('Tournaments is done');
    await fillFromNobelLaureates(extraData);
    console.log('Laureates is done');

};

module.exports = fillFactTable;