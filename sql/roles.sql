-- Least-privilege login roles for PhyloPic.
--
-- Replaces the single shared role that every app authenticated as, which held read
-- and write access to both databases.
-- Creating new roles rather than changing one password also gives a zero-downtime
-- cutover: both the old and new credentials work until the old role is dropped.
--
-- Privileges below are derived from what each consumer actually executes:
--
--   phylopic_api      apps/api "dynamic" lambda. Reads everything in
--                     phylopic-entities. The one write is
--                     `INSERT INTO collection` in operations/postCollection.ts.
--                     Never touches phylopic-source.
--   phylopic_source   apps/contribute and apps/edit. Read/write on
--                     phylopic-source. No DELETE: source deletion is a soft
--                     delete (`UPDATE ... SET disabled=1::bit` in PGEditor).
--   phylopic_publish  apps/publish. Reads phylopic-source, and writes
--                     phylopic-entities (INSERT in make/insertEntities.ts,
--                     DELETE in make/cleanEntities.ts).
--
-- Run as a superuser or the database owner. Sections 2 and 3 must run against
-- their respective databases, hence the \connect lines; run this whole file with
-- `psql -f roles.sql` rather than pasting it piecemeal.


-- ---------------------------------------------------------------------------
-- 1. Roles (cluster-wide; run once)
-- ---------------------------------------------------------------------------

-- Deliberately created without passwords. Set them afterwards with psql's
-- \password, which prompts, hashes client-side, and sends only the verifier, so
-- the cleartext never reaches ~/.psql_history or the server log:
--
--     \password phylopic_api
--     \password phylopic_source
--     \password phylopic_publish
--
-- A role with no password cannot authenticate under md5/scram, so each is inert
-- until you do this.

-- PostgreSQL has no CREATE ROLE IF NOT EXISTS, so guard each one to keep this
-- file safe to re-run after a partial failure.
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'phylopic_api') THEN
        CREATE ROLE phylopic_api LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'phylopic_source') THEN
        CREATE ROLE phylopic_source LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'phylopic_publish') THEN
        CREATE ROLE phylopic_publish LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
    END IF;
END
$$;

-- A connection cap on the internet-facing role would leave headroom for the
-- editorial tools if the API is ever flooded, but it is deliberately NOT set here:
-- apps/api opens a fresh connection per request (PG_CLIENT_SERVICE creates a
-- `new Client` and calls `end()` each invocation), so concurrent connections track
-- lambda concurrency directly and too low a cap is itself an outage. If you want
-- one, size it against measured peak concurrency and `SHOW max_connections`:
--
--     ALTER ROLE phylopic_api CONNECTION LIMIT <n>;


-- ---------------------------------------------------------------------------
-- 2. phylopic-entities
-- ---------------------------------------------------------------------------

\connect "phylopic-entities"

GRANT CONNECT ON DATABASE "phylopic-entities" TO phylopic_api, phylopic_publish;
GRANT USAGE ON SCHEMA public TO phylopic_api, phylopic_publish;

-- No CREATE: neither app issues DDL. On PostgreSQL 14 and earlier, PUBLIC holds
-- CREATE on the public schema by default, so revoke it explicitly.
REVOKE CREATE ON SCHEMA public FROM phylopic_api, phylopic_publish;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO phylopic_api;
GRANT INSERT ON TABLE public.collection TO phylopic_api;

GRANT SELECT, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO phylopic_publish;

-- node_name.id is GENERATED ALWAYS AS IDENTITY, not serial, so it needs no
-- separate USAGE grant on a sequence; INSERT on the table is sufficient.

-- Keep these grants correct if the schema is ever rebuilt from
-- phylopic-entities.sql, which would otherwise create tables with no grants.
-- Without FOR ROLE these apply only to tables created by the role running this
-- file, so add `FOR ROLE <owner>` if the rebuild is performed by someone else.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO phylopic_api;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, DELETE ON TABLES TO phylopic_publish;


-- ---------------------------------------------------------------------------
-- 3. phylopic-source
-- ---------------------------------------------------------------------------

\connect "phylopic-source"

GRANT CONNECT ON DATABASE "phylopic-source" TO phylopic_source, phylopic_publish;
GRANT USAGE ON SCHEMA public TO phylopic_source, phylopic_publish;
REVOKE CREATE ON SCHEMA public FROM phylopic_source, phylopic_publish;

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO phylopic_source;

-- Publish only reads the system of record.
GRANT SELECT ON ALL TABLES IN SCHEMA public TO phylopic_publish;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO phylopic_source;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO phylopic_publish;


-- ---------------------------------------------------------------------------
-- 4. Verification
-- ---------------------------------------------------------------------------

-- Run in each database to review what was actually granted:
--
--     SELECT grantee, table_name, string_agg(privilege_type, ', ' ORDER BY privilege_type)
--     FROM information_schema.role_table_grants
--     WHERE grantee IN ('phylopic_api', 'phylopic_source', 'phylopic_publish')
--     GROUP BY grantee, table_name
--     ORDER BY grantee, table_name;
--
-- Expected in phylopic-entities: phylopic_api has SELECT on every table and
-- additionally INSERT on collection only.
--
-- Confirm the API role cannot write outside collection, without writing anything.
-- Expected: t for collection, f for every other table.
--
--     SELECT tablename, has_table_privilege('phylopic_api', 'public.' || tablename, 'INSERT')
--     FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;


-- ---------------------------------------------------------------------------
-- 5. Post-cutover hardening (only after the old role is retired)
-- ---------------------------------------------------------------------------

-- Do NOT run these until every consumer is confirmed working on the new roles;
-- revoking from PUBLIC affects the old shared role too, and dropping it is
-- irreversible.
--
--     REVOKE ALL ON DATABASE "phylopic-entities" FROM PUBLIC;
--     REVOKE ALL ON DATABASE "phylopic-source" FROM PUBLIC;
--
--     REASSIGN OWNED BY <old_role> TO <new_owner>;
--     DROP OWNED BY <old_role>;
--     DROP ROLE <old_role>;
