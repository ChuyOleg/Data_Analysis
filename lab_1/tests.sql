-- select * from public.population
-- where locid = 804
-- and location like 'Ukraine'
-- and popDensity = 75.382

-- select * from mainschema.fact_table
-- where pop_density = 75.382
-- and	location_id = (select location_id from mainschema.location_dimension where location like 'Ukraine') 

-- select * from public.nobel_laureates
-- where full_name like 'Roger Penrose'

-- select * from mainschema.fact_table
-- where human_id = (select human_id from mainschema.human_dimension where full_name like 'Roger Penrose')

-- select * from mainschema.human_dimension
-- where full_name like 'Roger Penrose'

-- запустити догрузку даних

-- select * from mainschema.location_dimension
-- where locid = 740

-- select * from mainschema.fact_table
-- where location_id = (select location_id from mainschema.location_dimension where location like 'New Suriname')

-- запустити догрузку даних

-- clear all tables
-- truncate table mainschema.time_dimension cascade;
-- truncate table mainschema.location_dimension cascade;
-- truncate table mainschema.gender_dimension cascade;
-- truncate table mainschema.sport_dimension cascade;
-- truncate table mainschema.medal_dimension cascade;
-- truncate table mainschema.category_dimension cascade;
-- truncate table mainschema.organization_dimension cascade;
-- truncate table mainschema.laureate_type_dimension cascade;
-- truncate table mainschema.laureate_info cascade;
-- truncate table mainschema.human_dimension cascade;
