-- Database: phylopic-source

-- DROP DATABASE IF EXISTS "phylopic-source";

CREATE DATABASE "phylopic-source"
    WITH 
    OWNER = master
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Table: public.contributor

-- DROP TABLE IF EXISTS public.contributor;

CREATE TABLE IF NOT EXISTS public.contributor
(
    uuid uuid NOT NULL,
    name character varying(128) COLLATE pg_catalog."default",
    email character varying(128) COLLATE pg_catalog."default" NOT NULL,
    show_email bit(1) NOT NULL DEFAULT (1)::bit(1),
    created timestamp without time zone NOT NULL DEFAULT now(),
    modified timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT contributor_pkey PRIMARY KEY (uuid),
    CONSTRAINT contributor_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.contributor
    OWNER to master;

-- Table: public.node

-- DROP TABLE IF EXISTS public.node;

CREATE TABLE IF NOT EXISTS public.node
(
    uuid uuid NOT NULL,
    names json NOT NULL,
    parent_uuid uuid,
    created timestamp without time zone NOT NULL DEFAULT now(),
    modified timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT node_pkey PRIMARY KEY (uuid),
    CONSTRAINT node_parent_uuid_fkey FOREIGN KEY (parent_uuid)
        REFERENCES public.node (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.node
    OWNER to master;
-- Index: fki_node_parent_uuid_fkey

-- DROP INDEX IF EXISTS public.fki_node_parent_uuid_fkey;

CREATE INDEX IF NOT EXISTS fki_node_parent_uuid_fkey
    ON public.node USING btree
    (parent_uuid ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.external

-- DROP TABLE IF EXISTS public.external;

CREATE TABLE IF NOT EXISTS public.external
(
    authority character varying(64) COLLATE pg_catalog."default" NOT NULL,
    namespace character varying(64) COLLATE pg_catalog."default" NOT NULL,
    object_id character varying(64) COLLATE pg_catalog."default" NOT NULL,
    node_uuid uuid NOT NULL,
    CONSTRAINT external_pkey PRIMARY KEY (authority, namespace, object_id),
    CONSTRAINT external_node_uuid_fkey FOREIGN KEY (node_uuid)
        REFERENCES public.node (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.external
    OWNER to master;

-- Table: public.image

-- DROP TABLE IF EXISTS public.image;

CREATE TABLE IF NOT EXISTS public.image
(
    uuid uuid NOT NULL,
    contributor_uuid uuid NOT NULL,
    specific_uuid uuid NOT NULL,
    general_uuid uuid,
    attribution character varying(128) COLLATE pg_catalog."default",
    license character varying(64) COLLATE pg_catalog."default" NOT NULL,
    sponsor character varying(128) COLLATE pg_catalog."default",
    created timestamp without time zone NOT NULL DEFAULT now(),
    modified timestamp without time zone NOT NULL DEFAULT now(),
    submitted bit(1) NOT NULL DEFAULT (0)::bit(1),
    accepted bit(1) NOT NULL DEFAULT (0)::bit(1),
    CONSTRAINT image_pkey PRIMARY KEY (uuid),
    CONSTRAINT image_contributor_uuid_fkey FOREIGN KEY (contributor_uuid)
        REFERENCES public.contributor (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT image_general_uuid_fkey FOREIGN KEY (general_uuid)
        REFERENCES public.node (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT image_specific_uuid_fkey FOREIGN KEY (specific_uuid)
        REFERENCES public.node (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.image
    OWNER to master;
-- Index: fki_image_general_uuid_fkey

-- DROP INDEX IF EXISTS public.fki_image_general_uuid_fkey;

CREATE INDEX IF NOT EXISTS fki_image_general_uuid_fkey
    ON public.image USING btree
    (general_uuid ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_image_specific_uuid_fkey

-- DROP INDEX IF EXISTS public.fki_image_specific_uuid_fkey;

CREATE INDEX IF NOT EXISTS fki_image_specific_uuid_fkey
    ON public.image USING btree
    (specific_uuid ASC NULLS LAST)
    TABLESPACE pg_default;
