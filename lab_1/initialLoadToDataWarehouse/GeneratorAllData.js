"use strict";

const DataRecipient = require('./DataRecipientFromDB');
const dataRecipient = new DataRecipient();

class GenerateAllData {

    async getTimeData(table) {

        if (table != 'population' && table != 'tournaments' && table != 'nobel_laureates') {
            throw new Error(`${table} isn't exist. Check arguments!`);
        }

        const oldColumnNames = (table === 'population') ? ['time'] : ['year'];
        const uniqueTime = await dataRecipient.getRows(`public.${table}`, oldColumnNames[0]);
        const uniqueFilterTime = uniqueTime.filter(obj => obj[oldColumnNames[0]] < 2021);
        const newColumnNames = 'year';
        
        return [ uniqueFilterTime, newColumnNames, oldColumnNames ];
    }

    async getLocationData(table) {
        
        if (table != 'population' && table != 'tournaments' && table != 'nobel_laureates') {
            throw new Error(`${table} isn't exist. Check arguments!`);
        }

        let newColumnNames = 'location';
        if (table === 'population') newColumnNames = 'location, locid';
        
        let oldColumnNames;
        let uniqueCountries;

        if (table === 'population') oldColumnNames = ['location', 'locid'];
        else if (table === 'tournaments') oldColumnNames = ['country'];
        else oldColumnNames = ['birth_country'];
        
        if (table === 'population') uniqueCountries = await dataRecipient.getRows(`public.${table}`, 'location', 'locid');
        else uniqueCountries = await dataRecipient.getRows(`public.${table}`, oldColumnNames[0]);

        return [ uniqueCountries, newColumnNames, oldColumnNames ];
    }

    getGenderData() {
        
        const uniqueGender = [{ gender: 'male' }, { gender: 'female' }, { gender: 'total' }, { gender: null}];
        const newColumnNames = 'gender';
        
        return [ uniqueGender, newColumnNames ];
    }

    async getSportData() {
        
        const uniqueSports = await dataRecipient.getRows('public.tournaments', 'sport', 'discipline', 'event');
        const newColumnNames = 'sport, discipline, event';
        
        return [ uniqueSports, newColumnNames ];
    }

    async getMedalData() {
        
        const uniqueMedals = await dataRecipient.getRows('public.tournaments', 'medal');
        const newColumnNames = 'medal';
        
        return [ uniqueMedals, newColumnNames ];
    }

    async getCategoryData() {
        
        const uniqueCategories = await dataRecipient.getRows('public.nobel_laureates', 'category');
        const newColumnNames = 'category';
        
        return [ uniqueCategories, newColumnNames ];
    }

    async getOrganizationData() {
        
        const uniqueOrganizations = await dataRecipient.getRows('public.nobel_laureates', 'organization_name', 'organization_city', 'organization_country');
        const newColumnNames = 'organization_name, organization_city, organization_country';
        
        return [ uniqueOrganizations, newColumnNames ];
    }

    async getLaureateTypeData() {
        
        const uniqueLaureateTypes = await dataRecipient.getRows('public.nobel_laureates', 'laureate_type');
        const newColumnNames = 'laureate_type';
        
        return [ uniqueLaureateTypes, newColumnNames ];
    }

    async getHumanData() {
        
        const uniqueAthletes = await dataRecipient.getRows('public.tournaments', 'athlete');
        const uniqueLaureates = await dataRecipient.getRows('public.nobel_laureates', 'full_name', 'birth_date', 'birth_city', 'birth_country', 'death_date', 'death_city', 'death_country'); 
        
        const uniqueHumans = uniqueAthletes.concat(uniqueLaureates);
        const newColumnNames = 'full_name, laureate_info_id'
        
        return [ uniqueHumans, newColumnNames ];
    }

    getLaureateInfoColumns() {

        const newColumnNames = 'birth_date, birth_city, birth_country, death_date, death_city, death_country';
        
        return newColumnNames;
    }

};

module.exports = GenerateAllData;
