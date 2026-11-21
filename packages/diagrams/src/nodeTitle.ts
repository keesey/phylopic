import type { Nomen } from "@phylopic/utils"
import { shortenNomen, stringifyNomen } from "@phylopic/utils"

export type NodeTitleSource = Readonly<{
    title?: string
    names?: readonly Nomen[]
    _links?: { self?: { title?: string } }
}>

export const nodeTitle = (item: NodeTitleSource): string | undefined => {
    const linkTitle = item.title ?? item._links?.self?.title
    if (linkTitle?.trim()) {
        return linkTitle.trim()
    }
    const nomen = item.names?.[0]
    if (nomen) {
        const fromNomen = stringifyNomen(shortenNomen(nomen)).trim()
        if (fromNomen) {
            return fromNomen
        }
    }
    return undefined
}
