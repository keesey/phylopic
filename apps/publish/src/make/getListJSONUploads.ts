import { createSearch, compareStrings, shortenNomen, stringifyNomen, stringifyNormalized, UUID } from "@phylopic/utils"
import {
    buildListIndexJSON,
    buildListPageItemsJSON,
    buildListPageLinksJSON,
    ListItem,
    paginateListItems,
} from "./buildListJSON.js"
import getContributorJSON from "./getContributorJSON.js"
import getImageJSON from "./getImageJSON.js"
import getNodeJSON from "./getNodeJSON.js"
import type { SourceData } from "./getSourceData.js"
import {
    DefaultListName,
    getDefaultListIndexKey,
    getDefaultListPageKey,
    getLineageIndexKey,
    getLineagePageKey,
} from "../entities/getListJSONKey.js"

const getContributorCount = (data: SourceData, uuid: UUID): number =>
    [...data.images.values()].filter(({ contributor, unlisted }) => !unlisted && contributor === uuid).length

const compareContributorEntries = (
    a: Readonly<[UUID, number, string]>,
    b: Readonly<[UUID, number, string]>,
) => b[1] - a[1] || compareStrings(a[2], b[2]) || compareStrings(a[0], b[0])

const getContributorItems = (data: SourceData): readonly ListItem[] =>
    [...data.contributors.entries()]
        .map(([uuid, contributor]) => [uuid, getContributorCount(data, uuid), contributor.created] as const)
        .filter(([, count]) => count > 0)
        .sort(compareContributorEntries)
        .map(([uuid, count]) => {
            const contributor = data.contributors.get(uuid)!
            return {
                json: stringifyNormalized(getContributorJSON(uuid, data, count)),
                title: contributor.name || null,
                uuid,
            }
        })

const getNodeItems = (data: SourceData): readonly ListItem[] =>
    [...data.nodes.keys()]
        .sort((a, b) => (data.sortIndices.get(a) ?? 0) - (data.sortIndices.get(b) ?? 0) || compareStrings(a, b))
        .map(uuid => {
            const node = data.nodes.get(uuid)!
            const titleNomen = node.names[0]
            return {
                json: stringifyNormalized(getNodeJSON(uuid, data)),
                title: titleNomen ? stringifyNomen(shortenNomen(titleNomen)) : null,
                uuid,
            }
        })

const getImageItems = async (data: SourceData): Promise<readonly ListItem[]> => {
    const entries = [...data.images.entries()]
        .filter(([, image]) => !image.unlisted)
        .sort(
            (a, b) =>
                compareStrings(b[1].created, a[1].created) || compareStrings(a[0], b[0]),
        )
    return Promise.all(
        entries.map(async ([uuid, image]) => {
            const titleNomen = data.nodes.get(image.specific)?.names[0]
            return {
                json: stringifyNormalized(await getImageJSON(uuid, data)),
                title: titleNomen ? stringifyNomen(shortenNomen(titleNomen)) : null,
                uuid,
            }
        }),
    )
}

export type DefaultListJSONUpload = Readonly<{
    body: string
    key: string
}>

export type DefaultListConfig = Readonly<{
    defaultTitle: string
    itemsPerPage: number
    linkHref: (uuid: UUID) => string
    listName: DefaultListName
    listPath: string
}>

const buildDefaultListUploads = (
    data: SourceData,
    items: readonly ListItem[],
    { defaultTitle, itemsPerPage, linkHref, listName, listPath }: DefaultListConfig,
): readonly DefaultListJSONUpload[] => {
    const build = data.build
    const listQuery = { build }
    const uploads: DefaultListJSONUpload[] = [
        {
            key: getDefaultListIndexKey(build, listName),
            body: buildListIndexJSON(build, listPath, listQuery, items.length, itemsPerPage),
        },
    ]
    const pages = paginateListItems(items, itemsPerPage)
    pages.forEach((pageItems, pageIndex) => {
        const lastPage = pageIndex === pages.length - 1
        uploads.push({
            key: getDefaultListPageKey(build, listName, pageIndex, "links"),
            body: buildListPageLinksJSON(
                build,
                listPath,
                { ...listQuery, page: pageIndex },
                pageIndex,
                lastPage,
                pageItems,
                linkHref,
                defaultTitle,
            ),
        })
        uploads.push({
            key: getDefaultListPageKey(build, listName, pageIndex, "items"),
            body: buildListPageItemsJSON(
                build,
                listPath,
                { ...listQuery, page: pageIndex, embed_items: true },
                pageIndex,
                lastPage,
                pageItems,
                linkHref,
                defaultTitle,
            ),
        })
    })
    return uploads
}

export const getContributorListJSONUploads = (data: SourceData): readonly DefaultListJSONUpload[] =>
    buildDefaultListUploads(data, getContributorItems(data), {
        defaultTitle: "[Anonymous]",
        itemsPerPage: 96,
        linkHref: uuid => `/contributors/${uuid}${createSearch({ build: data.build })}`,
        listName: "contributors",
        listPath: "/contributors",
    })

export const getNodeListJSONUploads = (data: SourceData): readonly DefaultListJSONUpload[] =>
    buildDefaultListUploads(data, getNodeItems(data), {
        defaultTitle: "[Unnamed]",
        itemsPerPage: 48,
        linkHref: uuid => `/nodes/${uuid}${createSearch({ build: data.build })}`,
        listName: "nodes",
        listPath: "/nodes",
    })

export const getImageListJSONUploads = async (data: SourceData): Promise<readonly DefaultListJSONUpload[]> =>
    buildDefaultListUploads(data, await getImageItems(data), {
        defaultTitle: "[Untitled]",
        itemsPerPage: 48,
        linkHref: uuid => `/images/${uuid}${createSearch({ build: data.build })}`,
        listName: "images",
        listPath: "/images",
    })

export const getLineageJSONUploads = (data: SourceData, uuid: UUID): readonly DefaultListJSONUpload[] => {
    const items: ListItem[] = []
    let current: UUID | undefined = uuid
    while (current) {
        const node = data.nodes.get(current)
        if (!node) {
            break
        }
        const titleNomen = node.names[0]
        items.push({
            json: stringifyNormalized(getNodeJSON(current, data)),
            title: titleNomen ? stringifyNomen(shortenNomen(titleNomen)) : null,
            uuid: current,
        })
        current = node.parent ?? undefined
    }
    const listPath = `/nodes/${encodeURIComponent(uuid)}/lineage`
    const build = data.build
    const listQuery = { build }
    const itemsPerPage = 48
    const linkHref = (nodeUUID: UUID) => `/nodes/${nodeUUID}${createSearch({ build })}`
    const uploads: DefaultListJSONUpload[] = [
        {
            key: getLineageIndexKey(build, uuid),
            body: buildListIndexJSON(build, listPath, listQuery, items.length, itemsPerPage),
        },
    ]
    const pages = paginateListItems(items, itemsPerPage)
    pages.forEach((pageItems, pageIndex) => {
        const lastPage = pageIndex === pages.length - 1
        uploads.push({
            key: getLineagePageKey(build, uuid, pageIndex, "links"),
            body: buildListPageLinksJSON(
                build,
                listPath,
                { ...listQuery, page: pageIndex },
                pageIndex,
                lastPage,
                pageItems,
                linkHref,
                "[Unnamed]",
            ),
        })
        uploads.push({
            key: getLineagePageKey(build, uuid, pageIndex, "items"),
            body: buildListPageItemsJSON(
                build,
                listPath,
                { ...listQuery, page: pageIndex, embed_items: true },
                pageIndex,
                lastPage,
                pageItems,
                linkHref,
                "[Unnamed]",
            ),
        })
    })
    return uploads
}

export const getAllLineageJSONUploads = (data: SourceData): readonly DefaultListJSONUpload[] =>
    [...data.nodes.keys()].flatMap(uuid => getLineageJSONUploads(data, uuid))
