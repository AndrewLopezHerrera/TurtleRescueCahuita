-- ==========================================
-- 2. DATOS DE PRUEBA (CATÁLOGOS BASE)
-- ==========================================

INSERT INTO roles (name) VALUES ('Admin'), ('Researcher'), ('Volunteer')
ON CONFLICT (name) DO NOTHING;

INSERT INTO vivarium (name) VALUES ('Vivero Playa Negra'), ('Vivero Puerto Vargas');

INSERT INTO species_turtle (name) VALUES ('Baula'), ('Verde'), ('Carey');

INSERT INTO state_nest (name) VALUES ('Incubando'), ('Eclosionado'), ('Saqueado');

INSERT INTO activity_turtle_sighting (name) VALUES ('Camando'), ('Desovando'), ('Regresando al mar');

INSERT INTO final_activity_turtle (name) VALUES ('Nido relocalizado'), ('Nido dejado in-situ'), ('Falsa cama');

-- ==========================================
-- 3. PRUEBA DE PROCEDIMIENTOS Y FUNCIONES
-- ==========================================

-- A. Crear usuario líder de patrulla (id será 1)
CALL sp_create_user(
    'andrew.lopez', 
    'hash_secreto_123', 
    1, -- Admin
    'Andrew', 
    'Denilson', 
    'Lopez', 
    'Herrera'
);

-- Probar login
SELECT fn_sign_in('andrew.lopez') AS password_recuperada;

-- B. Registrar avistamiento en playa (id será 1)
CALL sp_create_activity_beach(
    CURRENT_DATE, 
    1, -- Lider (Andrew)
    '22:45:00', 
    2, -- Desovando
    1, -- Baula
    1, -- Nido relocalizado
    'Tortuga en buen estado, sin marcas previas.'
);

-- Verificar vista mediante función
SELECT * FROM fn_see_activities_beach();

-- C. Registrar el nido en el vivero asociado al avistamiento 1
CALL sp_add_nest(
    1, -- id_beach_activity
    1, -- Vivero Playa Negra
    '23:30:00', 
    'BAU-2026-001', 
    78, -- huevos normales
    12, -- huevos vanos
    1   -- Incubando
);

-- =========================================================================
-- 1. PRUEBAS DE ACTIVIDADES DE PLAYA (sp_create_activity_beach)
-- =========================================================================

-- Actividad 2: Tortuga Verde desovando -> Nido relocalizado
CALL sp_create_activity_beach(
    (CURRENT_DATE - INTERVAL '2 days')::DATE,
    1,               -- leader
    '21:15:00'::TIME,-- time_sighting
    2,               -- Desovando
    2,               -- Verde
    1,               -- Nido relocalizado
    'Hembra adulta sin marcas en aletas. Playa tranquila y marea baja.'
);

-- Actividad 3: Tortuga Carey desovando -> Nido dejado in-situ
CALL sp_create_activity_beach(
    (CURRENT_DATE - INTERVAL '2 days')::DATE,
    1,               -- leader
    '23:40:00'::TIME,-- time_sighting
    2,               -- Desovando
    3,               -- Carey
    2,               -- Nido dejado in-situ
    'Nido en zona alta segura, bien camuflado por la tortuga. Se deja natural.'
);

-- Actividad 4: Tortuga Baula camando -> Falsa cama
CALL sp_create_activity_beach(
    (CURRENT_DATE - INTERVAL '1 day')::DATE,
    1,               -- leader
    '00:20:00'::TIME,-- time_sighting
    1,               -- Camando
    1,               -- Baula
    3,               -- Falsa cama
    'Encontró un tronco enterrado en la arena y regresó al mar sin desovar.'
);

-- Actividad 5: Tortuga Verde desovando -> Nido relocalizado
CALL sp_create_activity_beach(
    (CURRENT_DATE - INTERVAL '1 day')::DATE,
    1,               -- leader
    '01:50:00'::TIME,-- time_sighting
    2,               -- Desovando
    2,               -- Verde
    1,               -- Nido relocalizado
    'Nido muy cerca de la línea de marea alta, riesgo de inundación.'
);

-- Actividad 6: Tortuga Baula desovando -> Nido relocalizado
CALL sp_create_activity_beach(
    CURRENT_DATE,
    1,               -- leader
    '22:10:00'::TIME,-- time_sighting
    2,               -- Desovando
    1,               -- Baula
    1,               -- Nido relocalizado
    'Segundo avistamiento de Baula en el sector norte.'
);

-- Actividad 7: Tortuga Carey regresando al mar -> Nido relocalizado
CALL sp_create_activity_beach(
    CURRENT_DATE,
    1,               -- leader
    '02:05:00'::TIME,-- time_sighting
    3,               -- Regresando al mar
    3,               -- Carey
    1,               -- Nido relocalizado
    'Se localizó la cámara de huevos siguiendo el rastro fresco.'
);

-- Nido asociado a Actividad 2 (Verde) -> Vivero Playa Negra (1)
CALL sp_add_nest(
    2,                  -- id_beach_activity
    1,                  -- Vivero Playa Negra
    '22:00:00'::TIME,   -- hatchery_arrival_time
    'VER-2026-001',     -- nest_code
    104,                -- normal_eggs
    5,                  -- yolkless_eggs
    1                   -- Incubando
);

-- Nido asociado a Actividad 5 (Verde) -> Vivero Puerto Vargas (2)
CALL sp_add_nest(
    5,                  -- id_beach_activity
    2,                  -- Vivero Puerto Vargas
    '02:35:00'::TIME,   -- hatchery_arrival_time
    'VER-2026-002',     -- nest_code
    96,                 -- normal_eggs
    3,                  -- yolkless_eggs
    2                   -- Eclosionado
);

-- Nido asociado a Actividad 6 (Baula) -> Vivero Puerto Vargas (2)
CALL sp_add_nest(
    6,                  -- id_beach_activity
    2,                  -- Vivero Puerto Vargas
    '22:55:00'::TIME,   -- hatchery_arrival_time
    'BAU-2026-002',     -- nest_code
    68,                 -- normal_eggs
    24,                 -- yolkless_eggs
    1                   -- Incubando
);

-- Nido asociado a Actividad 7 (Carey) -> Vivero Playa Negra (1)
CALL sp_add_nest(
    7,                  -- id_beach_activity
    1,                  -- Vivero Playa Negra
    '02:50:00'::TIME,   -- hatchery_arrival_time
    'CAR-2026-001',     -- nest_code
    132,                -- normal_eggs
    2,                  -- yolkless_eggs
    3                   -- Saqueado
);

-- ==========================================
-- VERIFICACIÓN DE REPORTES
-- ==========================================
SELECT * FROM vw_information_nest_in_vivarium;
SELECT * FROM vw_report_total_encounters_by_species;
SELECT * FROM vw_report_average_encounters_by_species;
SELECT * FROM vw_general_status_nest;
SELECT * FROM vw_status_nest_by_vivarium;