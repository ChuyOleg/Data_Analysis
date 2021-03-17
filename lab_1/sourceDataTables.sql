-- create tables for loading source data

create table public.tournaments(
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

create table public.population(
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

create table public.nobel_laureates(
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

create table mainschema.location_dimension(
	location_id serial Primary Key,
	location text
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

create table mainschema.laureate_info(
	laureate_info_id serial Primary Key,
	birth_date text,
	birth_city text,
	birth_country text,
	death_date text,
	death_city text,
	death_country text
);

create table mainschema.human_dimension(
	human_id serial Primary Key,
	full_name text,
	laureate_info_id int references mainschema.laureate_info(laureate_info_id)
)

create table mainschema.medal_dimension(
	medal_id serial Primary Key,
	medal text
);

create table mainschema.category_dimension(
	category_id serial Primary Key,
	category text
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
	location_id int NOT NULL references mainschema.location_dimension(location_id),
	gender_id int references mainschema.gender_dimension(gender_id),
	sport_id int references mainschema.sport_dimension(sport_id),
	human_id int references mainschema.human_dimension(human_id),
	medal_id int references mainschema.medal_dimension(medal_id),
	category_id int references mainschema.category_dimension(category_id),
	laureate_type_id int references mainschema.laureate_type_dimension(laureate_type_id),
	organization_id int references mainschema.organization_dimension(organization_id),
	fact_type text,
	win_tournament text,
	win_prize text,
	population float,
	pop_density float
);

-- create triggers
create or replace function loadNewPopulation() returns trigger as
	$$ declare
  	time_id int;
  	location_id int;
  	gender_id int;
  	begin
  
  	select td.time_id from mainschema.time_dimension td where year = new.time into time_id;
  	select ld.location_id from mainschema.location_dimension ld where location like new.location into location_id;
  
  	if (time_id is NULL) then
		insert into mainschema.time_dimension(year) values(new.time);
		select td.time_id from mainschema.time_dimension td where year = new.time into time_id;
  	end if;
  
  	if (location_id is NULL) then
		insert into mainschema.location_dimension(location) values(new.location);
		select ld.location_id from mainschema.location_dimension ld where location like new.location into location_id;
  	end if;

  	if (new.popmale is not null) then
		select gd.gender_id from mainschema.gender_dimension gd where gender like 'male' into gender_id;
    	insert into mainschema.fact_table(time_id, location_id, fact_type, gender_id, population)
		values(time_id, location_id, 'population', gender_id, new.popmale);
  	end if;
  
	if (new.popfemale is not null) then
		select gd.gender_id from mainschema.gender_dimension gd where gender like 'female' into gender_id;
		insert into mainschema.fact_table(time_id, location_id, fact_type, gender_id, population)
		values(time_id, location_id, 'population', gender_id, new.popfemale);
	end if;
	
	if (new.poptotal is not null) then
		select gd.gender_id from mainschema.gender_dimension gd where gender like 'total' into gender_id;
		insert into mainschema.fact_table(time_id, location_id, fact_type, gender_id, population)
		values(time_id, location_id, 'population', gender_id, new.poptotal);
	end if;
	
	if (new.popdensity is not null) then
		insert into mainschema.fact_table(time_id, location_id, fact_type, pop_density)
		values(time_id, location_id, 'pop_density', new.popdensity);
	end if;

 	return New;
  	end $$
  	language plpgsql;
  
create Trigger loadNewPopulationData
  	after insert on public.population
  	for each row
  	execute procedure loadNewPopulation();
