"use strict";

const db = require('../db');

const fillFromPopulation = require('./fillFactTable/fillFactTableFromPopulation');
const fillFromTournaments = require('./fillFactTable/fillFactTableFromTournaments');
const fillFromNobelLaureates = require('./fillFactTable/fillFactTableFromNobelLaureates');

const fillFactTable = async (extraData) => {

    // await fillFromPopulation(extraData);
    // await fillFromTournaments(extraData);
    await fillFromNobelLaureates(extraData);

};

module.exports = fillFactTable;