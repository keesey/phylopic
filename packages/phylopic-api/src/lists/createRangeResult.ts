import { APIGatewayProxyResult } from "aws-lambda"
import { Link } from "phylopic-api-models/src"
import CACHE_PER_BUILD_HEADERS from "../headers/responses/CACHE_PER_BUILD_HEADERS"
import CORS_HEADERS from "../headers/responses/CORS_HEADERS"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
const formatNumber = (n: number) => (isFinite(n) ? JSON.stringify(n) : '"*"')
const getRange = (
    start: number,
    length: number,
    total: number,
    delta: -1 | 1,
): { start: number; length: number } | null => {
    const newStart = Math.max(0, start + delta * length)
    if (newStart === start || newStart >= total) {
        return null
    }
    const newLength = delta === -1 ? Math.min(start, length) : length
    if (newLength < 1) {
        return null
    }
    return { start: newStart, length: newLength }
}
const addRange = (href: string, start: number, length: number, total: number, delta: -1 | 1): Link | null => {
    const range = getRange(start, length, total, delta)
    if (!range) {
        return null
    }
    const parts = href.split("?", 2)
    const search = parts[1] ?? ""
    const query = search
        .split("&")
        .map(searchPart => searchPart.split("=", 2).map(decodeURIComponent))
        .reduce<Record<string, string>>((prev, [name, value]) => ({ ...prev, [name]: value }), {})
    query.start = range.start.toString(10)
    query.length = range.length.toString(10)
    const newSearch = Object.entries(query)
        .map(entry => JSON.stringify(entry))
        .sort()
        .map(entry => JSON.parse(entry) as [string, string])
        .map(([name, value]) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
        .join("&")
    return {
        href: parts[0] + "?" + newSearch,
    }
}
export const createRangeResult = (params: {
    href: string
    items: readonly string[]
    length: number
    start: number
    total: number
}): APIGatewayProxyResult => {
    const { href, items, length, start, total } = params
    return {
        body: `{"_embedded":{"items":[${items.join(",")}]},"_links":{"next":${JSON.stringify(
            addRange(href, start, length, total, 1),
        )},"previous":${JSON.stringify(addRange(href, start, length, total, -1))},"self":{"href":${JSON.stringify(
            href,
        )}}},"range":[${formatNumber(start)},${formatNumber(start + items.length)}],"total":${formatNumber(total)}}`,
        headers: {
            ...CACHE_PER_BUILD_HEADERS,
            ...CORS_HEADERS,
            ...DATA_HEADERS,
            "access-control-allow-headers": "accept,authorization,if-match,if-none-match",
        },
        statusCode: 200,
    }
}
export default createRangeResult
