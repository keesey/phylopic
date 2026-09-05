import { createSearch, compareStrings, shortenNomen, stringifyNomen, UUID } from "@phylopic/utils"
import { buildListIndexJSON, buildListPageLinksJSON, ListLinkItem, paginateListItems } from "./buildListJSON.js"
import type { SourceData } from "./getSourceData.js"
import { ListName, getListIndexKey, getListPageKey, getLineageIndexKey, getLineagePageKey } from "@phylopic/utils-s3"

const LINEAGE_LOG_INTERVAL = 500

const getContributorCount = (data: SourceData, uuid: UUID): number =>
    [...data.images.values()].filter(({ contributor, unlisted }) => !unlisted && contributor === uuid).length

const compareContributorEntries = (a: Readonly<[UUID, number, string]>, b: Readonly<[UUID, number, string]>) =>
    b[1] - a[1] || compareStrings(a[2], b[2]) || compareStrings(a[0], b[0])

const getContributorItems = (data: SourceData): readonly ListLinkItem[] =>
    [...data.contributors.entries()]
        .map(([uuid, contributor]) => [uuid, getContributorCount(data, uuid), contributor.created] as const)
        .filter(([, count]) => count > 0)
        .sort(compareContributorEntries)
        .map(([uuid]) => ({
            title: data.contributors.get(uuid)?.name || null,
            uuid,
        }))

const getNodeItems = (data: SourceData): readonly ListLinkItem[] =>
    [...data.nodes.keys()]
        .sort((a, b) => (data.sortIndices.get(a) ?? 0) - (data.sortIndices.get(b) ?? 0) || compareStrings(a, b))
        .map(uuid => {
            const node = data.nodes.get(uuid)!
            const titleNomen = node.names[0]
            return {
                title: titleNomen ? stringifyNomen(shortenNomen(titleNomen)) : null,
                uuid,
            }
        })

const getImageItems = (data: SourceData): readonly ListLinkItem[] =>
    [...data.images.entries()]
        .filter(([, image]) => !image.unlisted)
        .sort((a, b) => compareStrings(b[1].created, a[1].created) || compareStrings(a[0], b[0]))
        .map(([uuid, image]) => {
            const titleNomen = data.nodes.get(image.specific)?.names[0]
            return {
                title: titleNomen ? stringifyNomen(shortenNomen(titleNomen)) : null,
                uuid,
            }
        })

export type ListJSONUpload = Readonly<{
    body: string
    key: string
}>

export type ListConfig = Readonly<{
    defaultTitle: string
    itemsPerPage: number
    linkHref: (uuid: UUID) => string
    listName: ListName
    listPath: string
}>

const buildListUploads = (
    data: SourceData,
    items: readonly ListLinkItem[],
    { defaultTitle, itemsPerPage, linkHref, listName, listPath }: ListConfig,
): readonly ListJSONUpload[] => {
    const build = data.build
    const listQuery = { build }
    const uploads: ListJSONUpload[] = [
        {
            key: getListIndexKey(build, listName),
            body: buildListIndexJSON(build, listPath, listQuery, items.length, itemsPerPage),
        },
    ]
    const pages = paginateListItems(items, itemsPerPage)
    pages.forEach((pageItems, pageIndex) => {
        const lastPage = pageIndex === pages.length - 1
        uploads.push({
            key: getListPageKey(build, listName, pageIndex),
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
    })
    return uploads
}

export const getContributorListJSONUploads = (data: SourceData): readonly ListJSONUpload[] =>
    buildListUploads(data, getContributorItems(data), {
        defaultTitle: "[Anonymous]",
        itemsPerPage: 96,
        linkHref: uuid => `/contributors/${uuid}${createSearch({ build: data.build })}`,
        listName: "contributors",
        listPath: "/contributors",
    })

export const getNodeListJSONUploads = (data: SourceData): readonly ListJSONUpload[] =>
    buildListUploads(data, getNodeItems(data), {
        defaultTitle: "[Unnamed]",
        itemsPerPage: 48,
        linkHref: uuid => `/nodes/${uuid}${createSearch({ build: data.build })}`,
        listName: "nodes",
        listPath: "/nodes",
    })

export const getImageListJSONUploads = (data: SourceData): readonly ListJSONUpload[] =>
    buildListUploads(data, getImageItems(data), {
        defaultTitle: "[Untitled]",
        itemsPerPage: 48,
        linkHref: uuid => `/images/${uuid}${createSearch({ build: data.build })}`,
        listName: "images",
        listPath: "/images",
    })

export const getLineageJSONUploads = (data: SourceData, uuid: UUID): readonly ListJSONUpload[] => {
    const items: ListLinkItem[] = []
    let current: UUID | undefined = uuid
    while (current) {
        const node = data.nodes.get(current)
        if (!node) {
            break
        }
        const titleNomen = node.names[0]
        items.push({
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
    const uploads: ListJSONUpload[] = [
        {
            key: getLineageIndexKey(build, uuid),
            body: buildListIndexJSON(build, listPath, listQuery, items.length, itemsPerPage),
        },
    ]
    const pages = paginateListItems(items, itemsPerPage)
    pages.forEach((pageItems, pageIndex) => {
        const lastPage = pageIndex === pages.length - 1
        uploads.push({
            key: getLineagePageKey(build, uuid, pageIndex),
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
    })
    return uploads
}

export const queueAllLineageJSONUploads = (data: SourceData, putUpload: (upload: ListJSONUpload) => void) => {
    const nodeUUIDs = [...data.nodes.keys()]
    nodeUUIDs.forEach((uuid, index) => {
        if (index % LINEAGE_LOG_INTERVAL === 0) {
            console.info(`Building lineage JSON ${index}/${nodeUUIDs.length}...`)
        }
        for (const upload of getLineageJSONUploads(data, uuid)) {
            putUpload(upload)
        }
    })
}
