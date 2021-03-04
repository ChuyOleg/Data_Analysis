-- create tables for loading source data

create table tournaments(
	year int,
	city text,
	sport text,
	discipline text,
	athlete text,
	country text,
	gender varchar(24),
	event text,
	medal varchar(24)
);

create table population(
	locid int,
	location text,
	varid int,
	variant text,
	time int,
	midperiod float,
	popmale float,
	popfemale float,
	poptotal float,
	popdensity float
);

create table nobel_laureates(
	Year int,
	Category text,
	Prize text,
	Motivation text,
	Prize_Share text,
	Laureate_ID int,
	Laureate_Type text,
	Full_Name text,
	Birth_Date text,
	Birth_City text,
	Birth_Country text,
	Sex text,
	Organization_Name text,
	Organization_City text,
	Organization_Country text,
	Death_Date text,
	Death_City text,
	Death_Country text	
);

-- create new SCHEMA and dimension tables
 
create SCHEMA mainschema;

create table mainschema.time_dimension(
	time_id serial Primary Key,
	year int
);

create table mainschema.country_dimension(
	country_id serial Primary Key,
	country text
);

create table mainschema.gender_dimension(
	gender_id serial Primary Key,
	gender text
);

create table mainschema.sport_dimension(
	sport_id serial Primary Key,
	sport text,
	discipline text,
	event text
);

create table mainschema.athlete_dimension(
	athlete_id serial Primary Key,
	athlete text
);

create table mainschema.medal_dimension(
	medal_id serial Primary Key,
	medal text
);

create table mainschema.category_dimension(
	category_id serial Primary Key,
	category text
);

create table mainschema.laureate_dimension(
	laureate_id serial Primary Key,
	full_name text,
	birth_date date,
	birth_city text,
	birth_country text,
	death_date date,
	death_city text,
	death_country text
);

create table mainschema.laureate_type_dimension(
	laureate_type_id serial Primary Key,
	laureate_type text
);

create table mainschema.organization_dimension(
	organization_id serial Primary Key,
	organization_name text,
	organization_city text,
	organization_country text
);

-- create facts table

create table mainschema.fact_table(
	fact_id serial Primary Key,
	time_id int NOT NULL references mainschema.time_dimension(time_id),
	country_id int NOT NULL references mainschema.country_dimension(country_id),
	gender_id int references mainschema.gender_dimension(gender_id),
	sport_id int references mainschema.sport_dimension(sport_id),
	athlete_id int references mainschema.athlete_dimension(athlete_id),
	medal_id int references mainschema.medal_dimension(medal_id),
	category_id int references mainschema.category_dimension(category_id),
	laureate_id int references mainschema.laureate_dimension(laureate_id),
	laureate_type_id int references mainschema.laureate_type_dimension(laureate_type_id),
	organization_id int references mainschema.organization_dimension(organization_id),
	fact_type text,
	win_tournament text,
	win_prize text,
	population float,
	pop_density float
);