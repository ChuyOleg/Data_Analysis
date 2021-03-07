"use strict";

const getUniqueData = require('./getDestinctDataFromDB');

class GenerateAllData {

    async getTimeData(table) {

        if (table != 'population' && table != 'tournaments' && table != 'nobel_laureates') {
            throw new Error(`${table} isn't exist. Check arguments!`);
        }

        const oldColumnNames = (table === 'population') ? ['time'] : ['year'];
        const uniqueTime = await getUniqueData(`public.${table}`, oldColumnNames[0]);
        const newColumnNames = 'year';
        
        return [ uniqueTime, newColumnNames, oldColumnNames ];
    }

    async getLocationData(table) {
        
        if (table != 'population' && table != 'tournaments' && table != 'nobel_laureates') {
            throw new Error(`${table} isn't exist. Check arguments!`);
        }

        const newColumnNames = 'location';
        let oldColumnNames;

        if (table === 'population') oldColumnNames = ['location'];
        else if (table === 'tournaments') oldColumnNames = ['country'];
        else oldColumnNames = ['birth_country'];
   
        const uniqueCountries = await getUniqueData(`public.${table}`, oldColumnNames[0]);

        return [ uniqueCountries, newColumnNames, oldColumnNames ];
    }

    getGenderData() {
        
        const uniqueGender = [{ gender: 'male' }, { gender: 'female' }, { gender: 'total' }];
        const newColumnNames = 'gender';
        
        return [ uniqueGender, newColumnNames ];
    }

    async getSportData() {
        
        const uniqueSports = await getUniqueData('public.tournaments', 'sport', 'discipline', 'event');
        const newColumnNames = 'sport, discipline, event';
        
        return [ uniqueSports, newColumnNames ];
    }

    async getMedalData() {
        
        const uniqueMedals = await getUniqueData('public.tournaments', 'medal');
        const newColumnNames = 'medal';
        
        return [ uniqueMedals, newColumnNames ];
    }

    async getCategoryData() {
        
        const uniqueCategories = await getUniqueData('public.nobel_laureates', 'category');
        const newColumnNames = 'category';
        
        return [ uniqueCategories, newColumnNames ];
    }

    async getOrganizationData() {
        
        const uniqueOrganizations = await getUniqueData('public.nobel_laureates', 'organization_name', 'organization_city', 'organization_country');
        const newColumnNames = 'organization_name, organization_city, organization_country';
        
        return [ uniqueOrganizations, newColumnNames ];
    }

    async getLaureateTypeData() {
        
        const uniqueLaureateTypes = await getUniqueData('public.nobel_laureates', 'laureate_type');
        const newColumnNames = 'laureate_type';
        
        return [ uniqueLaureateTypes, newColumnNames ];
    }

    async getHumanData() {
        
        const uniqueAthletes = await getUniqueData('public.tournaments', 'athlete');
        const uniqueLaureates = await getUniqueData('public.nobel_laureates', 'birth_date', 'birth_city', 'birth_country', 'death_date', 'death_city', 'death_country'); 
        
        const uniqueHumans = uniqueAthletes.concat(uniqueLaureates);
        const newColumnNames = 'full_name, laureate_info_id'
        
        return [ uniqueHumans, newColumnNames ];
    }

    async getLaureateInfoColumns() {

        const newColumnNames = 'birth_date, birth_city, birth_country, death_data, death_city, death_country';
        
        return newColumnNames;
    }

};

module.exports = GenerateAllData;
