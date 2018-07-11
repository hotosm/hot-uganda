CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    surveyor_name character varying(50),
    sub_date DATE NOT NULL,
    phonenumber character varying(50),
    household_location geometry(Point,4326),
    contested_plot_boundary geometry(MULTILINESTRING,4326),
    plot_boundary geometry(LINESTRING,4326),
    wastepit_location geometry(Point,4326),
    toilet_location geometry(Point,4326),
    addr_zone character varying(50),
    addr_block character varying(50), 
    contested character varying(50),
    contested_with character varying(50),
    contested_phone character varying(50),
    ext_plot_claim character varying(50),
    ext_plot_reference character varying(50),
    empty_household character varying(50),
    plot_ownerother character varying(50),
    plotboundary_responsible character varying(50),
    hh_sanitation character varying(50),
    chemical character varying(50),
    flush character varying(50),
    pitlatrine character varying(50),
    bucket character varying(50),
    empty_householdname character varying(50), 
    addr_local_name character varying(50),
    household_head character varying(50),
    family_name character varying(50),
    no_in_household character varying(50),
    ref_card_number character varying(200),
    mobile character varying(50),
    country character varying(50),
    has_toilet character varying(50),
    has_disposal character varying(50), 
    cookstove_present character varying(50),
    cookstove_installer character varying(50),
    date_cookstove_installed character varying(50),
    own_plot character varying(50),
    plot_description character varying(50),
    addr_village character varying(50),
    created timestamp with time zone DEFAULT NOW(),
    updated timestamp with time zone DEFAULT NOW(),
     UNIQUE (ref_card_number,plot_boundary,family_name)
);


CREATE TABLE boundaries (
    id SERIAL PRIMARY KEY,
    surveyor_name character varying(50),
    sub_date DATE NOT NULL,
    phonenumber character varying(50),
    household_location geometry(Point,4326),
    contested_plot_boundary geometry(MULTILINESTRING,4326),
    plot_boundary geometry(LINESTRING,4326),
    wastepit_location geometry(Point,4326),
    toilet_location geometry(Point,4326),
    addr_zone character varying(50),
    addr_block character varying(50), 
    contested character varying(50),
    contested_with character varying(50),
    contested_phone character varying(50),
    ext_plot_claim character varying(50),
    ext_plot_reference character varying(50),
    empty_household character varying(50),
    plot_ownerother character varying(50),
    plotboundary_responsible character varying(50),
    hh_sanitation character varying(50),
    chemical character varying(50),
    flush character varying(50),
    pitlatrine character varying(50),
    bucket character varying(50),
    empty_householdname character varying(50), 
    addr_local_name character varying(50),
    household_head character varying(50),
    family_name character varying(50),
    no_in_household character varying(50),
    ref_card_number character varying(200),
    mobile character varying(50),
    country character varying(50),
    has_toilet character varying(50),
    has_disposal character varying(50), 
    cookstove_present character varying(50),
    cookstove_installer character varying(50),
    date_cookstove_installed character varying(50),
    own_plot character varying(50),
    plot_description character varying(50),
    clean INT default 0 ,
    addr_village character varying(50),
    created timestamp with time zone DEFAULT NOW(),
    updated timestamp with time zone DEFAULT NOW(),
     UNIQUE (ref_card_number,plot_boundary,family_name)
);


CREATE TABLE updates (
  id SERIAL PRIMARY KEY,
  last_offset INT NOT NULL,
  created timestamp with time zone DEFAULT NOW(),
  updated timestamp with time zone DEFAULT NOW()
);




DROP TABLE if exists d_date;

CREATE TABLE d_date
(
  date_dim_id              INT NOT NULL,
  date_actual              DATE NOT NULL,
  epoch                    BIGINT NOT NULL,
  day_suffix               VARCHAR(4) NOT NULL,
  day_name                 VARCHAR(9) NOT NULL,
  day_of_week              INT NOT NULL,
  day_of_month             INT NOT NULL,
  day_of_quarter           INT NOT NULL,
  day_of_year              INT NOT NULL,
  week_of_month            INT NOT NULL,
  week_of_year             INT NOT NULL,
  week_of_year_iso         CHAR(10) NOT NULL,
  month_actual             INT NOT NULL,
  month_name               VARCHAR(9) NOT NULL,
  month_name_abbreviated   CHAR(3) NOT NULL,
  quarter_actual           INT NOT NULL,
  quarter_name             VARCHAR(9) NOT NULL,
  year_actual              INT NOT NULL,
  first_day_of_week        DATE NOT NULL,
  last_day_of_week         DATE NOT NULL,
  first_day_of_month       DATE NOT NULL,
  last_day_of_month        DATE NOT NULL,
  first_day_of_quarter     DATE NOT NULL,
  last_day_of_quarter      DATE NOT NULL,
  first_day_of_year        DATE NOT NULL,
  last_day_of_year         DATE NOT NULL,
  mmyyyy                   CHAR(6) NOT NULL,
  mmddyyyy                 CHAR(10) NOT NULL,
  weekend_indr             BOOLEAN NOT NULL
);

CREATE TABLE updates (
  id SERIAL PRIMARY KEY,
  last_offset INT NOT NULL,
  created timestamp with time zone DEFAULT NOW(),
  updated timestamp with time zone DEFAULT NOW()
);

ALTER TABLE public.d_date ADD CONSTRAINT d_date_date_dim_id_pk PRIMARY KEY (date_dim_id);

CREATE INDEX d_date_date_actual_idx
  ON d_date(date_actual);

COMMIT;

INSERT INTO d_date
SELECT TO_CHAR(datum,'yyyymmdd')::INT AS date_dim_id,
       datum AS date_actual,
       EXTRACT(epoch FROM datum) AS epoch,
       TO_CHAR(datum,'fmDDth') AS day_suffix,
       TO_CHAR(datum,'Day') AS day_name,
       EXTRACT(isodow FROM datum) AS day_of_week,
       EXTRACT(DAY FROM datum) AS day_of_month,
       datum - DATE_TRUNC('quarter',datum)::DATE +1 AS day_of_quarter,
       EXTRACT(doy FROM datum) AS day_of_year,
       TO_CHAR(datum,'W')::INT AS week_of_month,
       EXTRACT(week FROM datum) AS week_of_year,
       TO_CHAR(datum,'YYYY"-W"IW-') || EXTRACT(isodow FROM datum) AS week_of_year_iso,
       EXTRACT(MONTH FROM datum) AS month_actual,
       TO_CHAR(datum,'Month') AS month_name,
       TO_CHAR(datum,'Mon') AS month_name_abbreviated,
       EXTRACT(quarter FROM datum) AS quarter_actual,
       CASE
         WHEN EXTRACT(quarter FROM datum) = 1 THEN 'First'
         WHEN EXTRACT(quarter FROM datum) = 2 THEN 'Second'
         WHEN EXTRACT(quarter FROM datum) = 3 THEN 'Third'
         WHEN EXTRACT(quarter FROM datum) = 4 THEN 'Fourth'
       END AS quarter_name,
       EXTRACT(isoyear FROM datum) AS year_actual,
       datum +(1 -EXTRACT(isodow FROM datum))::INT AS first_day_of_week,
       datum +(7 -EXTRACT(isodow FROM datum))::INT AS last_day_of_week,
       datum +(1 -EXTRACT(DAY FROM datum))::INT AS first_day_of_month,
       (DATE_TRUNC('MONTH',datum) +INTERVAL '1 MONTH - 1 day')::DATE AS last_day_of_month,
       DATE_TRUNC('quarter',datum)::DATE AS first_day_of_quarter,
       (DATE_TRUNC('quarter',datum) +INTERVAL '3 MONTH - 1 day')::DATE AS last_day_of_quarter,
       TO_DATE(EXTRACT(isoyear FROM datum) || '-01-01','YYYY-MM-DD') AS first_day_of_year,
       TO_DATE(EXTRACT(isoyear FROM datum) || '-12-31','YYYY-MM-DD') AS last_day_of_year,
       TO_CHAR(datum,'mmyyyy') AS mmyyyy,
       TO_CHAR(datum,'mmddyyyy') AS mmddyyyy,
       CASE
         WHEN EXTRACT(isodow FROM datum) IN (6,7) THEN TRUE
         ELSE FALSE
       END AS weekend_indr
FROM (SELECT '2017-01-01'::DATE+ SEQUENCE.DAY AS datum
      FROM GENERATE_SERIES (0,29219) AS SEQUENCE (DAY)
      GROUP BY SEQUENCE.DAY) DQ
ORDER BY 1;

COMMIT;




