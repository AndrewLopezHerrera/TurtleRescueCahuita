
-- Esta sección corresponde a los usuarios
CREATE TABLE IF NOT EXISTS roles (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- Ej: 'Admin', 'Researcher', 'Volunteer'
);

CREATE TABLE IF NOT EXISTS users(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_name TEXT NOT NULL,
	password TEXT NOT NULL,
	is_active BOOL NOT NULL,
	role_user INT NOT NULL REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS person(
	id INT PRIMARY KEY NOT NULL REFERENCES users(id),
    first_name TEXT NOT NULL,
	second_name TEXT,
    first_last_name TEXT NOT NULL,
    second_last_name TEXT
);

CREATE TABLE IF NOT EXISTS permissions (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL -- Ej: 'turtle_register:create'
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

--Esta sección es para los viveros

CREATE TABLE IF NOT EXISTS vivarium (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name TEXT NOT NULL
);

--Esta sección corresponde a los registros de Nidos
CREATE TABLE IF NOT EXISTS species_turtle (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS state_nest (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS final_activity_turtle (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	NAME TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_turtle_sighting (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS beach_activity (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	date_activity DATE NOT NULL,
	leader INT NOT NULL REFERENCES person(id),
	time_sighting TIME NOT NULL,
	id_activity_turtle_sighting INT NOT NULL REFERENCES activity_turtle_sighting(id),
	specie_turtle INT NOT NULL REFERENCES species_turtle(id),
	id_final_activity_turtle INT NOT NULL REFERENCES final_activity_turtle(id),
	comments_activity TEXT
);

CREATE TABLE IF NOT EXISTS nest_turtle (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	id_beach_activity INT NOT NULL REFERENCES beach_activity(id),
	vivarium_nest INT NOT NULL REFERENCES vivarium(id),
	hatchery_arrival_time TIME NOT NULL,
	nest_code TEXT NOT NULL,
	normal_eggs INT NOT NULL,
	yolkless_eggs INT NOT NULL,
	id_state_nest INT NOT NULL REFERENCES state_nest(id)
);

--Esta sección corresponde a la sección de para crear reportes
CREATE OR REPLACE VIEW vw_report_total_encounters_by_species
AS
SELECT
	ST.name AS especie,
	SUM(NT.normal_eggs) AS huevos_normales,
	SUM(NT.yolkless_eggs) AS huevos_vanos,
	SUM(NT.normal_eggs + NT.yolkless_eggs) AS total
FROM
	beach_activity AS BA
INNER JOIN
	species_turtle AS ST
ON
	BA.specie_turtle = ST.id
INNER JOIN
	nest_turtle AS NT
ON
	NT.id_beach_activity = BA.id
GROUP BY
	Especie;

CREATE OR REPLACE VIEW vw_report_average_encounters_by_species
AS
SELECT
	ST.name AS especie,
	AVG(NT.normal_eggs) AS huevos_normales,
	AVG(NT.yolkless_eggs) AS huevos_vanos,
	AVG(NT.normal_eggs + NT.yolkless_eggs) AS total
FROM
	beach_activity AS BA
INNER JOIN
	species_turtle AS ST
ON
	BA.specie_turtle = ST.id
INNER JOIN
	nest_turtle AS NT
ON
	NT.id_beach_activity = BA.id
GROUP BY
	Especie;

CREATE OR REPLACE VIEW vw_report_amount_encounters_by_species
AS
SELECT
	ST.name AS especie,
	COUNT(NT.id) AS total
FROM
	beach_activity AS BA
INNER JOIN
	species_turtle AS ST
ON
	BA.specie_turtle = ST.id
INNER JOIN
	nest_turtle AS NT
ON
	NT.id_beach_activity = BA.id
GROUP BY
	Especie;

CREATE OR REPLACE VIEW vw_general_status_nest
AS
SELECT
	SN.name AS estado,
	COUNT(NT.id_state_nest) AS cantidad
FROM
	nest_turtle AS NT
INNER JOIN
	state_nest AS SN
ON
	NT.id_state_nest = SN.id
GROUP BY
	Estado;

CREATE OR REPLACE VIEW vw_status_nest_by_vivarium
AS
SELECT
	VM.name AS vivero,
	SN.name AS estado,
	COUNT(NT.id_state_nest) AS Cantidad
FROM
	nest_turtle AS NT
INNER JOIN
	state_nest AS SN
ON
	NT.id_state_nest = SN.id
INNER JOIN
	vivarium AS VM
ON
	NT.vivarium_nest = VM.id
GROUP BY
	Vivero, Estado;

--Esta sección es para mostrar información general

CREATE OR REPLACE VIEW vw_information_activity_beach
AS
SELECT
	BA.id AS id,
	TO_CHAR(NOW() AT TIME ZONE 'America/Costa_Rica', 'TMDay, DD "de" TMMonth "de" YYYY') AS fecha,
	PN.first_name || ' ' || PN.first_last_name AS lider,
	TO_CHAR(BA.time_sighting, 'HH12:MI:SS AM') AS hora,
	ATS.name AS actividad_avistamiento,
	ST.name AS especie,
	FAT.name AS actividad_final,
	BA.comments_activity AS comentarios
FROM
	beach_activity AS BA
INNER JOIN
	activity_turtle_sighting ATS
ON
	BA.id_activity_turtle_sighting = ATS.id
INNER JOIN
	species_turtle AS ST
ON
	BA.specie_turtle = ST.id
INNER JOIN
	final_activity_turtle AS FAT
ON
	BA.id_final_activity_turtle = FAT.id
INNER JOIN
	person AS PN
ON
	BA.leader = PN.id;

CREATE OR REPLACE VIEW vw_information_nest_in_vivarium
AS
SELECT
	NT.id AS id,
	NT.id_beach_activity AS id_actividad_playa,
	VN.Name AS vivero,
	TO_CHAR(NT.hatchery_arrival_time, 'HH12:MI:SS AM') AS hora_llegada,
	NT.nest_code AS codigo_nido,
	NT.normal_eggs AS huevos_normales,
	NT.yolkless_eggs AS huevos_vanos,
	SN.name AS estado_nido
FROM
	nest_turtle AS NT
INNER JOIN
	state_nest AS SN
ON
	SN.id = NT.id_state_nest
INNER JOIN
	vivarium AS VN
ON
	NT.vivarium_nest = VN.id;

CREATE OR REPLACE VIEW vw_information_user
AS
SELECT
	US.id AS id,
	US.user_name AS user_name,
	RS.name AS role_user,
    PN.first_name AS first_name,
	PN.second_name AS second_name,
    PN.first_last_name AS first_last_name,
    PN.second_last_name AS second_last_name
FROM
	users AS US
INNER JOIN
	person AS PN
ON
	US.id = PN.id
INNER JOIN
	roles AS RS
ON
	US.role_user = RS.id;

--Procedimientos almacenados y funciones
CREATE OR REPLACE PROCEDURE sp_create_user
(
	in_user_name TEXT,
	in_password TEXT,
	in_role_user INT,
	in_first_name TEXT,
	in_second_name TEXT,
    in_first_last_name TEXT,
    in_second_last_name TEXT
)
LANGUAGE plpgsql
AS
$$
DECLARE
	temp_id_new_user INT;
BEGIN
	INSERT INTO users(user_name, password, role_user, is_active)
	VALUES (in_user_name, in_password, in_role_user, TRUE)
	RETURNING id INTO temp_id_new_user;
	INSERT INTO person(
		id,
		first_name,
		second_name,
    	first_last_name,
    	second_last_name
	) VALUES (
		temp_id_new_user,
		in_first_name,
		in_second_name,
	    in_first_last_name,
	    in_second_last_name
	);
EXCEPTION WHEN OTHERS THEN
	RAISE EXCEPTION 'El usuario no se pudo crear. Detalle técnico: % (Código: %)', SQLERRM, SQLSTATE;
END;
$$;

SELECT * FROM fn_sign_in('andrew.lopez');

CREATE OR REPLACE FUNCTION fn_sign_in
(
	in_user_name text
)
RETURNS TEXT
LANGUAGE plpgsql
AS
$$
DECLARE
	t_password TEXT;
BEGIN
	SELECT
		US.password
	INTO
		t_password
	FROM
		users AS US
	WHERE
		in_user_name = user_name;
	RETURN t_password;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_create_activity_beach
(
	in_date_activity DATE,
	in_leader INT,
	in_time_sighting TIME,
	in_id_activity_turtle_sighting INT,
	in_specie_turtle INT,
	in_id_final_activity_turtle INT,
	in_comments_activity TEXT
)
LANGUAGE plpgsql
AS
$$
BEGIN
	INSERT INTO beach_activity(
		date_activity,
		leader,
		time_sighting,
		id_activity_turtle_sighting,
		specie_turtle,
		id_final_activity_turtle,
		comments_activity
	)
	VALUES (
		in_date_activity,
		in_leader,
		in_time_sighting,
		in_id_activity_turtle_sighting,
		in_specie_turtle,
		in_id_final_activity_turtle,
		in_comments_activity
	);
END;
$$;

CREATE OR REPLACE FUNCTION fn_see_activities_beach
()
RETURNS SETOF vw_information_activity_beach
LANGUAGE plpgsql
AS
$$
BEGIN
	RETURN QUERY SELECT * FROM vw_information_activity_beach;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_add_nest(
	in_id_beach_activity INT,
	in_vivarium_nest INT,
	in_hatchery_arrival_time TIME,
	in_nest_code TEXT,
	in_normal_eggs INT,
	in_yolkless_eggs INT,
	in_id_state_nest INT
)
LANGUAGE plpgsql
AS
$$
BEGIN
	INSERT INTO nest_turtle(
		id_beach_activity,
		vivarium_nest,
		hatchery_arrival_time,
		nest_code,
		normal_eggs,
		yolkless_eggs,
		id_state_nest
	) VALUES (
		in_id_beach_activity,
		in_vivarium_nest,
		in_hatchery_arrival_time,
		in_nest_code,
		in_normal_eggs,
		in_yolkless_eggs,
		in_id_state_nest
	);
END;
$$;

CREATE OR REPLACE FUNCTION fn_see_nest
()
RETURNS SETOF nest_turtle
LANGUAGE plpgsql
AS
$$
BEGIN
	RETURN QUERY SELECT * FROM nest_turtle;
END;
$$;

CREATE OR REPLACE FUNCTION fn_get_report_total_encounters_by_species()
RETURNS SETOF vw_report_total_encounters_by_species
LANGUAGE sql
AS $$
    SELECT * FROM vw_report_total_encounters_by_species;
$$;

CREATE OR REPLACE FUNCTION fn_get_report_average_encounters_by_species()
RETURNS SETOF vw_report_average_encounters_by_species
LANGUAGE sql
AS $$
    SELECT * FROM vw_report_average_encounters_by_species;
$$;

CREATE OR REPLACE FUNCTION fn_get_report_amount_encounters_by_species()
RETURNS SETOF vw_report_amount_encounters_by_species
LANGUAGE sql
AS $$
    SELECT * FROM vw_report_amount_encounters_by_species;
$$;

CREATE OR REPLACE FUNCTION fn_get_general_status_nest()
RETURNS SETOF vw_general_status_nest
LANGUAGE sql
AS $$
    SELECT * FROM vw_general_status_nest;
$$;

CREATE OR REPLACE FUNCTION fn_get_status_nest_by_vivarium()
RETURNS SETOF vw_status_nest_by_vivarium
LANGUAGE sql
AS $$
    SELECT * FROM vw_status_nest_by_vivarium;
$$;

CREATE OR REPLACE FUNCTION fn_get_info_user
(
	in_user_name TEXT
)
RETURNS SETOF vw_information_user
LANGUAGE sql
AS
$$
	SELECT * FROM vw_information_user WHERE vw_information_user.user_name = in_user_name;
$$