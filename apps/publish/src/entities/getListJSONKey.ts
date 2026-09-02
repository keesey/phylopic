import { UUID } from "@phylopic/utils"

export type DefaultListName = "contributors" | "images" | "nodes"

export type ListPageVariant = "items" | "links"

const encode = (segment: string | number) => encodeURIComponent(String(segment))

export const getDefaultListIndexKey = (build: number, name: DefaultListName) =>
    [build, "lists", name, "index"].map(encode).join("/") + ".json"

export const getDefaultListPageKey = (build: number, name: DefaultListName, page: number, variant: ListPageVariant) =>
    [build, "lists", name, "pages", `${page}.${variant}`].map(encode).join("/") + ".json"

export const getLineageIndexKey = (build: number, uuid: UUID) =>
    [build, "lineage", uuid, "index"].map(encode).join("/") + ".json"

export const getLineagePageKey = (build: number, uuid: UUID, page: number, variant: ListPageVariant) =>
    [build, "lineage", uuid, "pages", `${page}.${variant}`].map(encode).join("/") + ".json"
