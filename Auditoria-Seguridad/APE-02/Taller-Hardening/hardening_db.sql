-- =====================================================================
-- SCRIPT DE HARDENING SQL (POSTGRESQL 16) — PROYECTO: Kallpa UNL (futbol_db)
-- Principio de Saltzer & Schroeder #1 y #6: Mínimo Privilegio y
-- Separación de Privilegios en la capa de datos.
--
-- Las contraseñas NO se escriben aquí (Principio de Diseño Abierto / R01):
-- se pasan como variables de psql al ejecutar el script.
--
-- Uso (desde la raíz del repo, con el contenedor kallpa-postgres levantado
-- y las tablas ya creadas):
--   docker exec -i kallpa-postgres psql -v ON_ERROR_STOP=1 \
--     -v migrator_pass="$MIGRATOR_PASS" -v runtime_pass="$RUNTIME_PASS" \
--     -U dev_user -d futbol_db < Auditoria-Seguridad/APE-02/Taller-Hardening/hardening_db.sql
-- =====================================================================

-- 1. Rol de migraciones / despliegue (DDL): dueño del esquema de tablas
CREATE ROLE app_migrator WITH LOGIN PASSWORD :'migrator_pass';

-- 2. Rol de ejecución de la API FastAPI (solo DML)
CREATE ROLE app_runtime WITH LOGIN PASSWORD :'runtime_pass';

-- 3. Conexión a la base: nadie entra por defecto, solo los roles explícitos
REVOKE ALL ON DATABASE futbol_db FROM PUBLIC;
GRANT CONNECT ON DATABASE futbol_db TO app_migrator, app_runtime;

-- 4. Esquema public: solo app_migrator puede crear objetos
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE, CREATE ON SCHEMA public TO app_migrator;
GRANT USAGE ON SCHEMA public TO app_runtime;

-- 5. Las tablas pasan a ser propiedad de app_migrator (las secuencias
--    SERIAL de cada tabla cambian de dueño junto con ella). Así DROP/ALTER
--    solo los puede hacer app_migrator (o el superusuario).
ALTER TABLE users                 OWNER TO app_migrator;
ALTER TABLE accounts              OWNER TO app_migrator;
ALTER TABLE representatives       OWNER TO app_migrator;
ALTER TABLE athletes              OWNER TO app_migrator;
ALTER TABLE tests                 OWNER TO app_migrator;
ALTER TABLE sprint_tests          OWNER TO app_migrator;
ALTER TABLE endurance_tests       OWNER TO app_migrator;
ALTER TABLE yoyo_tests            OWNER TO app_migrator;
ALTER TABLE technical_assessments OWNER TO app_migrator;
ALTER TABLE evaluations           OWNER TO app_migrator;
ALTER TABLE attendances           OWNER TO app_migrator;
ALTER TABLE statistics            OWNER TO app_migrator;

-- Tipos ENUM creados por SQLAlchemy (roles, estados, etc.)
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT t.typname
             FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
            WHERE n.nspname = 'public' AND t.typtype = 'e'
  LOOP
    EXECUTE format('ALTER TYPE public.%I OWNER TO app_migrator', r.typname);
  END LOOP;
END $$;

-- 6. Permisos de app_runtime: solo leer, insertar y actualizar datos
GRANT SELECT, INSERT, UPDATE ON TABLE
  users, accounts, representatives, athletes, tests, sprint_tests,
  endurance_tests, yoyo_tests, technical_assessments, evaluations,
  attendances, statistics
TO app_runtime;

-- La app usa borrado lógico (is_active = false) en casi todo. La única
-- excepción es la sincronización de asistencias (attendance_dao.py), que
-- hace DELETE físico; por eso DELETE se concede SOLO en esa tabla.
GRANT DELETE ON TABLE attendances TO app_runtime;

-- Secuencias para los id autoincrementales
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_runtime;

-- Tablas/secuencias que app_migrator cree en el futuro heredan estos permisos
ALTER DEFAULT PRIVILEGES FOR ROLE app_migrator IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE ON TABLES TO app_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE app_migrator IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO app_runtime;

-- Nota: DROP no es un privilegio que se otorgue o revoque en PostgreSQL;
-- solo el DUEÑO de la tabla puede borrarla. Como app_runtime no es dueño
-- (paso 5) y no tiene TRUNCATE ni CREATE, no puede destruir la estructura.

-- 7. Prueba de verificación (conectado como app_runtime):
--   DROP TABLE users;          -> ERROR:  must be owner of table users
--   TRUNCATE users;            -> ERROR:  permission denied for table users
--   DELETE FROM users;         -> ERROR:  permission denied for table users
--   CREATE TABLE hack(id int); -> ERROR:  permission denied for schema public
--   SELECT count(*) FROM users;-> funciona (la app sigue operando)
