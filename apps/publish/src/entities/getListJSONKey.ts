import { UUID } from "@phylopic/utils"

export type DefaultListName = "contributors" | "images" | "nodes"

const encode = (segment: string | number) => encodeURIComponent(String(segment))

export const getDefaultListIndexKey = (build: number, name: DefaultListName) =>
    [build, "lists", name, "index"].map(encode).join("/") + ".json"

export const getDefaultListPageKey = (build: number, name: DefaultListName, page: number) =>
    [build, "lists", name, "pages", page].map(encode).join("/") + ".json"

export const getLineageIndexKey = (build: number, uuid: UUID) =>
    [build, "lineages", uuid, "index"].map(encode).join("/") + ".json"

export const getLineagePageKey = (build: number, uuid: UUID, page: number) =>
    [build, "lineages", uuid, "pages", page].map(encode).join("/") + ".json"
