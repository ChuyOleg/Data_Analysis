"use strict";

const db = require('../db');
const insertDataIntoTables = require('./insertDataIntoTables');
const fillFactTable = require('./fillingFactTable');
const ExtraData = require('./ExtraData');

const initialLoad = async () => {

    const extraData = new ExtraData();

    // for (const dim of extraData.dimensionArr) {
    //     for (const inputTable of extraData.inputTablesByDimension[dim]) {
    //         await insertDataIntoTables(inputTable, dim);
    //     }
    // }

    // await fillFactTable();

};

module.exports = initialLoad;