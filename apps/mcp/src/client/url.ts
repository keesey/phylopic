import { createSearch, parseQueryString, type URL } from "@phylopic/utils"

export const addBuildToURL = (url: URL, build: number) => {
    const [base, queryString] = url.split("?", 2)
    const query = parseQueryString(queryString ?? "")
    return base + createSearch({ ...query, build })
}

export const joinPath = (baseUrl: string, path: string) => {
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
    const normalizedPath = path.startsWith("/") ? path : `/${path}`
    return normalizedBase + normalizedPath
}

export const toSearchParams = (query: Readonly<Record<string, string | number | boolean | undefined>>) =>
    createSearch(
        Object.fromEntries(
            Object.entries(query).filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined),
        ),
    )
