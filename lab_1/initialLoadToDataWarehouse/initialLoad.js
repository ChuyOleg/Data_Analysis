"use strict";

const db = require('../db');
const insertDataIntoTables = require('./insertDataIntoTables');
const fillFactTable = require('./fillingFactTable');

const dimensionArr = ['time', 'gender', 'sport', 'medal', 'category', 'organization', 'laureate_type', 'location', 'human'];
const inputTablesByDimension = {
    time: ['population', 'tournaments', 'nobel_laureates'],
    gender: [null],
    sport: ['tournaments'],
    medal: ['tournaments'],
    category: ['nobel_laureates'],
    organization: ['nobel_laureates'],
    laureate_type: ['nobel_laureates'],
    location: ['population', 'tournaments', 'nobel_laureates'],
    human: [null],
};

const initialLoad = async () => {

    // for (const dim of dimensionArr) {
    //     for (const inputTable of inputTablesByDimension[dim]) {
    //         await insertDataIntoTables(inputTable, dim);
    //     }
    // }

    await fillFactTable();

};

module.exports = initialLoad;