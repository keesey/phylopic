import { createSearch, stringifyNormalized } from "@phylopic/utils"
import type { SourceData } from "./getSourceData.js"

export type ResolveObjectJSONEntry = Readonly<{
    authority: string
    body: string
    namespace: string
    objectID: string
}>

const getResolveObjectJSONEntries = (data: SourceData): readonly ResolveObjectJSONEntry[] =>
    [...data.externals.entries()].map(([identifier, link]) => {
        const [authority, namespace, objectID] = identifier.split("/", 3).map(decodeURIComponent)
        const nodeMatch = /^\/nodes\/(.+)$/.exec(link.href)
        const nodeUUID = nodeMatch ? decodeURIComponent(nodeMatch[1]) : link.href
        return {
            authority,
            namespace,
            objectID,
            body: stringifyNormalized({
                href: `/nodes/${encodeURIComponent(nodeUUID)}${createSearch({ build: data.build })}`,
                title: link.title ?? "",
            }),
        }
    })

export default getResolveObjectJSONEntries
