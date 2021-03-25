"use strict";

class ExtraData {

    dimensionArr = ['time', 'gender', 'sport', 'medal', 'category', 'organization', 'laureate_type', 'location', 'human'];

    inputTablesByDimension = {
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

}

module.exports = ExtraData;