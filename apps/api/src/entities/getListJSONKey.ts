import { UUID } from "@phylopic/utils"

export type ListName = "contributors" | "images" | "nodes"

export const getListIndexKey = (build: number, name: ListName) => `${build}/lists/${name}/index.json`

export const getListPageKey = (build: number, name: ListName, page: number) =>
    `${build}/lists/${name}/pages/${page}.json`

export const getLineageIndexKey = (build: number, uuid: UUID) => `${build}/lineages/${uuid}/index.json`

export const getLineagePageKey = (build: number, uuid: UUID, page: number) =>
    `${build}/lineages/${uuid}/pages/${page}.json`
