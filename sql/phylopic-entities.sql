-- Database: phylopic-entities

-- DROP DATABASE IF EXISTS "phylopic-entities";

CREATE DATABASE "phylopic-entities"
    WITH 
    OWNER = master
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- DROP TABLE IF EXISTS public.collection;

CREATE TABLE IF NOT EXISTS public.collection
(
    uuid uuid NOT NULL,
    uuids uuid[] NOT NULL,
    CONSTRAINT collection_pkey PRIMARY KEY (uuid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.collection
    OWNER to master;
    
-- Table: public.contributor

-- DROP TABLE IF EXISTS public.contributor;

CREATE TABLE IF NOT EXISTS public.contributor
(
    uuid uuid NOT NULL,
    build bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    json text COLLATE pg_catalog."default" NOT NULL,
    sort_index bigint NOT NULL,
    title character varying(64) COLLATE pg_catalog."default",
    CONSTRAINT contributor_id PRIMARY KEY (uuid, build),
    CONSTRAINT contributor_sort_index_unique UNIQUE (sort_index, build)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.contributor
    OWNER to master;

-- Table: public.image

-- DROP TABLE IF EXISTS public.image;

CREATE TABLE IF NOT EXISTS public.image
(
    uuid uuid NOT NULL,
    build bigint NOT NULL,
    created timestamp without time zone NOT NULL,
    contributor_uuid uuid NOT NULL,
    license_by bit(1) NOT NULL,
    license_nc bit(1) NOT NULL,
    license_sa bit(1) NOT NULL,
    json text COLLATE pg_catalog."default" NOT NULL,
    depth bigint NOT NULL DEFAULT 0,
    title character varying(64) COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    tags character varying[] COLLATE pg_catalog."default",
    CONSTRAINT image_id PRIMARY KEY (uuid, build),
    CONSTRAINT image_contributor_fkey FOREIGN KEY (build, contributor_uuid)
        REFERENCES public.contributor (build, uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.image
    OWNER to master;

-- Table: public.node

-- DROP TABLE IF EXISTS public.node;

CREATE TABLE IF NOT EXISTS public.node
(
    uuid uuid NOT NULL,
    build bigint NOT NULL,
    parent_uuid uuid,
    json text COLLATE pg_catalog."default" NOT NULL,
    sort_index bigint NOT NULL,
    title character varying(64) COLLATE pg_catalog."default",
    CONSTRAINT node_id PRIMARY KEY (uuid, build),
    CONSTRAINT node_sort_index_unique UNIQUE (sort_index, build),
    CONSTRAINT node_parent FOREIGN KEY (build, parent_uuid)
        REFERENCES public.node (build, uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.node
    OWNER to master;
-- Index: fki_node_parent

-- DROP INDEX IF EXISTS public.fki_node_parent;

CREATE INDEX IF NOT EXISTS fki_node_parent
    ON public.node USING btree
    (parent_uuid ASC NULLS LAST, build ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.node_name

-- DROP TABLE IF EXISTS public.node_name;

CREATE TABLE IF NOT EXISTS public.node_name
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    build bigint NOT NULL,
    node_uuid uuid NOT NULL,
    normalized character varying(256) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT node_name_id PRIMARY KEY (id),
    CONSTRAINT node_name_node_fkey FOREIGN KEY (build, node_uuid)
        REFERENCES public.node (build, uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.node_name
    OWNER to master;

-- Table: public.node_external

-- DROP TABLE IF EXISTS public.node_external;

CREATE TABLE IF NOT EXISTS public.node_external
(
    authority character varying(64) COLLATE pg_catalog."default" NOT NULL,
    namespace character varying(64) COLLATE pg_catalog."default" NOT NULL,
    objectid character varying(64) COLLATE pg_catalog."default" NOT NULL,
    build bigint NOT NULL,
    node_uuid uuid NOT NULL,
    title character varying(128) COLLATE pg_catalog."default",
    CONSTRAINT node_external_id PRIMARY KEY (authority, namespace, objectid, build),
    CONSTRAINT node_external_node_fkey FOREIGN KEY (build, node_uuid)
        REFERENCES public.node (build, uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.node_external
    OWNER to master;

-- Table: public.image_node

-- DROP TABLE IF EXISTS public.image_node;

CREATE TABLE IF NOT EXISTS public.image_node
(
    node_uuid uuid NOT NULL,
    build bigint NOT NULL,
    image_uuid uuid NOT NULL,
    CONSTRAINT image_node_id PRIMARY KEY (node_uuid, image_uuid, build),
    CONSTRAINT node_image_image FOREIGN KEY (image_uuid, build)
        REFERENCES public.image (uuid, build) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT image_node_node_fkey FOREIGN KEY (build, node_uuid)
        REFERENCES public.node (build, uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.image_node
    OWNER to master;
