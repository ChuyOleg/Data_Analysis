"use strict";

const db = require('../db');

const fillFromPopulation = require('./fillFactTable/fillFactTableFromPopulation');
const fillFromTournaments = require('./fillFactTable/fillFactTableFromTournaments');

const fillFactTable = async (extraData) => {

    await fillFromPopulation(extraData);
    await fillFromTournaments(extraData);
    // await fromFromNobelLaureates(extraData);

};

module.exports = fillFactTable;