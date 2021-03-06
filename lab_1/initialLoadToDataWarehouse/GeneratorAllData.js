"use strict";

const getUniqueData = require('./getDestinctDataFromDB');

class GenerateAllData {

    async getTimeData() {

        const uniqueTime = await getUniqueData('public.population', 'time');
        const columnNames = 'year';
        
        return { uniqueTime, columnNames };
    }

    async getLocationData() {
        
        const uniqueCountries = await getUniqueData('public.population', 'location');
        const columnNames = 'location';
        
        return { uniqueCountries, columnNames };
    }

    async getGenderData() {
        
        const uniqueGender = ['male', 'female', 'total'];
        const columnNames = 'gender';
        
        return { uniqueGender, columnNames };
    }

    async getSportData() {
        
        const uniqueSports = await getUniqueData('public.tournaments', 'sport', 'discipline', 'event');
        const columnNames = 'sport, discipline, event';
        
        return { uniqueSports, columnNames };
    }

    async getMedalData() {
        
        const uniqueMedals = await getUniqueData('public.tournaments', 'medal');
        const columnNames = 'medal';
        
        return { uniqueMedals, columnNames };
    }

    async getCategoryData() {
        
        const uniqueCategories = await getUniqueData('public.nobel_laureates', 'category');
        const columnNames = 'category';
        
        return { uniqueCategories, columnNames };
    }

    async getOrganizationData() {
        
        const uniqueOrganizations = await getUniqueData('public.nobel_laureates', 'organization_name', 'organization_city', 'organization_country');
        const columnNames = 'organization_name, organization_city, organization_country';
        
        return { uniqueOrganizations, columnNames };
    }

    async getLaureateTypeData() {
        
        const uniqueLaureateTypes = await getUniqueData('public.nobel_laureates', 'laureate_type');
        const columnNames = 'laureate_type';
        
        return { uniqueLaureateTypes, columnNames };
    }

    async getHumanData() {
        
        const uniqueAthletes = await getUniqueData('public.tournaments', 'athlete');
        const uniqueLaureates = await getUniqueData('public.nobel_laureates', 'birth_date', 'birth_city', 'birth_country', 'death_date', 'death_city', 'death_country'); 
        
        const uniqueHumans = uniqueAthletes.concat(uniqueLaureates);
        const columnNames = 'full_name, laureate_info_id'
        
        return { uniqueHumans, columnNames };
    }

    async getLaureateInfoColumns() {

        const columnNames = 'birth_date, birth_city, birth_country, death_data, death_city, death_country';
        
        return columnNames;
    }

};

module.exports = GenerateAllData;
