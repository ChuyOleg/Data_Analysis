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

    dimColumns = {
        time: ['year'],
        gender: ['gender'],
        sport: ['sport', 'discipline', 'event'],
        medal: ['medal'],
        category: ['category'],
        organization: ['organization_name', 'organization_city', 'organization_country'],
        laureate_type: ['laureate_type'],
        location: ['location'],
        human: ['full_name', 'laureate_info_id'],
        'laureate_info': ['birth_date', 'birth_city', 'birth_country', 'death_date', 'death_city', 'death_country'],
    };

    equalColumns = {
        time: 'year',
        year: 'year',
        location: 'location',
        country: 'location',
        'birth-country': 'location',
        gender: 'gender',
        sex: 'gender',
        sport: 'sport',
        discipline: 'discipline',
        athlete: 'full_name',
        event: 'event',
        medal: 'medal',
        category: 'category',
        'laureate_type': 'laureate_type',
        full_name: 'full_name',
        'birth-date': 'birth-date',
        'birth-city': 'birth-city',
        'birth-country': 'birth-country',
        'death-date': 'death-date',
        'death-city': 'death-city',
        'death-country': 'death-country',
        'organization_name': 'organization_name',
        'organization_city': 'organization_city',
        'organization_country': 'organization_country',
    };

}

module.exports = ExtraData;