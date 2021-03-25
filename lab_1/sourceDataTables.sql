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
	location text,
	locID int,
	load_data date default date('0001-01-01'),
	load_data_end date default date('9999-12-31')
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
);

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

-- for new data in public.population
create or replace function loadNewPopulation() returns trigger as
	$$ declare
  	time_id int;
  	my_location_id int;
  	gender_id int;
  	begin
  
  	select td.time_id from mainschema.time_dimension td where year = new.time into time_id;
  	select ld.location_id from mainschema.location_dimension ld where locid = new.locid into my_location_id;
  
  	if (time_id is NULL) then
		insert into mainschema.time_dimension(year) values(new.time);
		select td.time_id from mainschema.time_dimension td where year = new.time into time_id;
  	end if;
  
  	if (my_location_id is NULL) then
		insert into mainschema.location_dimension(location, locid) values(new.location, new.locid);
		select ld.location_id from mainschema.location_dimension ld where locid = new.locid into my_location_id;
  	else 
		if (new.location not like (select location from mainschema.location_dimension ld where ld.location_id = my_location_id)) then
		
		update mainschema.location_dimension
		set load_data_end = current_date
		where locid = new.locid ;
		
		insert into mainschema.location_dimension(location, locid, load_data, load_data_end)
		values(new.location, new.locid, current_date + 1, date('9999-12-31'));

		select ld.location_id from mainschema.location_dimension ld where locid = new.locid and location like new.location into my_location_id;
		
		end if;
	end if;
	
	

   	if (new.popmale is not null) then
		select gd.gender_id from mainschema.gender_dimension gd where gender like 'male' into gender_id;
    	insert into mainschema.fact_table(time_id, location_id, fact_type, gender_id, population)
 		values(time_id, my_location_id, 'population', gender_id, new.popmale);
   	end if;
  
 	if (new.popfemale is not null) then
 		select gd.gender_id from mainschema.gender_dimension gd where gender like 'female' into gender_id;
 		insert into mainschema.fact_table(time_id, location_id, fact_type, gender_id, population)
 		values(time_id, my_location_id, 'population', gender_id, new.popfemale);
 	end if;
	
	if (new.poptotal is not null) then
 		select gd.gender_id from mainschema.gender_dimension gd where gender like 'total' into gender_id;
 		insert into mainschema.fact_table(time_id, location_id, fact_type, gender_id, population)
 		values(time_id, my_location_id, 'population', gender_id, new.poptotal);
 	end if;
	
 	if (new.popdensity is not null) then
 		insert into mainschema.fact_table(time_id, location_id, fact_type, pop_density)
 		values(time_id, my_location_id, 'pop_density', new.popdensity);
 	end if;

 	return New;
  	end $$
  	language plpgsql;

  
create Trigger loadNewPopulationData
  	after insert on public.population
  	for each row
  	execute procedure loadNewPopulation();


-- for new data in public.nobel_laureates
create or replace function loadNewNobelLaureates() returns trigger as
	$$ declare
  	time_id int;
  	location_id int;
  	gender_id int;
	organization_id int;
	category_id int;
	laureate_type_id int;
	my_laureate_info_id int;
  	human_id int;
	begin

	select td.time_id from mainschema.time_dimension td where year = new.year into time_id;
	
	if (time_id is NULL) then
		insert into mainschema.time_dimension(year) values(new.year);
		select td.time_id from mainschema.time_dimension td where year = new.year into time_id;
  	end if;
	
	if (new.birth_country is null) then
		select ld.location_id from mainschema.location_dimension ld where location is null into location_id;
	else
		select ld.location_id from mainschema.location_dimension ld where lower(location) like lower(new.birth_country) into location_id;	
	end if;
	
	if (location_id is Null) then
		insert into mainschema.location_dimension(location) values(lower(new.birth_country));
		select ld.location_id from mainschema.location_dimension ld where lower(location) like lower(new.birth_country) into location_id;
	end if;
	
	if (new.sex is null) then
		select gd.gender_id from mainschema.gender_dimension gd where gender is null into gender_id;
	else
		select gd.gender_id from mainschema.gender_dimension gd where gender like lower(new.sex) into gender_id;
	end if;
	
	if (new.organization_name is null) then
		select od.organization_id from mainschema.organization_dimension od
			where organization_name is null
			and organization_city is null
			and organization_country is null
			into organization_id;
	else
		select od.organization_id from mainschema.organization_dimension od 
			where organization_name like new.organization_name
			and organization_city like new.organization_city
			and organization_country like new.organization_country
			into organization_id;
	end if;
	
	if (organization_id is null) then
		insert into mainschema.organization_dimension(organization_name, organization_city, organization_country) 
		values(new.organization_name, new.organization_city, new.organization_country);
		select od.organization_id from mainschema.organization_dimension od 
			where organization_name like new.organization_name
			and organization_city like new.organization_city
			and organization_country like new.organization_country
			into organization_id;
	end if;

	select cd.category_id from mainschema.category_dimension cd where category like new.category into category_id;
	
	if (category_id is null) then
		insert into mainschema.category_dimension(category) values(new.category);
		select cd.category_id from mainschema.category_dimension cd where category like new.category into category_id;
	end if;
	
	select lrd.laureate_type_id from mainschema.laureate_type_dimension lrd where laureate_type like new.laureate_type into laureate_type_id;

	if (new.birth_date is null) then
		select li.laureate_info_id from mainschema.laureate_info li
			where birth_date is null and birth_city is null and birth_country is null into my_laureate_info_id;
	elseif (new.death_date is null) then
		select li.laureate_info_id from mainschema.laureate_info li
			where birth_date like new.birth_date and birth_city like new.birth_city and birth_country like new.birth_country
			and death_date is null and death_city is null and death_country is null
			into my_laureate_info_id;
	else
		select li.laureate_info_id from mainschema.laureate_info li
			where birth_date like new.birth_date and birth_city like new.birth_city and birth_country like new.birth_country
			and death_date like new.death_date and death_city like new.death_city and death_country like new.death_country
			into my_laureate_info_id;
	end if;
	
	if (my_laureate_info_id is null) then
		insert into mainschema.laureate_info(birth_date, birth_city, birth_country, death_date, death_city, death_country)
		values(new.birth_date, new.birth_city, new.birth_country, new.death_date, new.death_city, new.death_country);
		if (new.death_date is null) then
			select li.laureate_info_id from mainschema.laureate_info li
				where birth_date like new.birth_date and birth_city like new.birth_city and birth_country like new.birth_country
				and death_date is null and death_city is null and death_country is null
				into my_laureate_info_id;
		else
			select li.laureate_info_id from mainschema.laureate_info li
				where birth_date like new.birth_date and birth_city like new.birth_city and birth_country like new.birth_country
				and death_date like new.death_date and death_city like new.death_city and death_country like new.death_country
				into my_laureate_info_id;
		end if;
	end if;

	select hd.human_id from mainschema.human_dimension hd
		where full_name like new.full_name and hd.laureate_info_id = my_laureate_info_id into human_id;

	if (human_id is null) then
		insert into mainschema.human_dimension(full_name, laureate_info_id) values(new.full_name, my_laureate_info_id);
		select hd.human_id from mainschema.human_dimension hd
		where full_name like new.full_name and hd.laureate_info_id = my_laureate_info_id into human_id;
	end if;
	
  	insert into mainschema.fact_table(time_id, location_id, gender_id, human_id, organization_id, category_id, laureate_type_id, fact_type, win_prize)
	values(time_id, location_id, gender_id, human_id, organization_id, category_id, laureate_type_id, 'win_prize', 'Yes');
  
 	return New;	
  	end $$
  	language plpgsql;

create Trigger loadNewNobelLaureatesData
  	after insert on public.nobel_laureates
  	for each row
  	execute procedure loadNewNobelLaureates();