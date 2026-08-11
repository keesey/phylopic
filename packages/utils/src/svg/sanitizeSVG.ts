import DOMPurify from "isomorphic-dompurify"

const SVG_CONTENT_TYPE = "image/svg+xml"

const PURIFY_CONFIG = {
    USE_PROFILES: { svg: true, svgFilters: true },
} as const

const REMOVABLE_THREAT_PATTERNS: readonly RegExp[] = [
    /<script[\s/>]/i,
    /<foreignObject[\s/>]/i,
    /<iframe[\s/>]/i,
    /\s(on[a-z]+|formaction)\s*=/i,
    /javascript:/i,
    /data:text\/html/i,
]

const ADOBE_PGF_BLOCK_PATTERN = /<i:pgf\b[\s\S]*?<\/i:pgf>/gi

/** Base64-like text nodes left behind when DOMPurify removes unknown metadata elements. */
const DANGLING_METADATA_TEXT_PATTERN = />[\t\n\r ]*(?:[A-Za-z0-9+/=][A-Za-z0-9+/=\t\n\r ]{79,})[\t\n\r ]*</

/** CDATA closing fragments left before the root element by broken Adobe Illustrator exports. */
const LEADING_CDATA_FRAGMENT_PATTERN = /^[\t\n\r ]*(?:\]\]?&gt;|\]\]>|\]>)+[\t\n\r ]*/

export const containsRemovableThreats = (svg: string): boolean =>
    REMOVABLE_THREAT_PATTERNS.some(pattern => pattern.test(svg))

export const hasLeadingSvgCorruption = (svg: string): boolean => LEADING_CDATA_FRAGMENT_PATTERN.test(svg)

const containsSanitizableCruft = (svg: string): boolean =>
    containsRemovableThreats(svg) ||
    hasLeadingSvgCorruption(svg) ||
    /<i:pgf[\s/>]/i.test(svg) ||
    DANGLING_METADATA_TEXT_PATTERN.test(svg)

const removeKnownMetadataBlocks = (svg: string): string => svg.replace(ADOBE_PGF_BLOCK_PATTERN, "")

const stripLeadingSvgCorruption = (svg: string): string => svg.replace(LEADING_CDATA_FRAGMENT_PATTERN, "")

const stripDanglingMetadataText = (svg: string): string =>
    svg.replace(/>([\t\n\r ]*(?:[A-Za-z0-9+/=][A-Za-z0-9+/=\t\n\r ]{79,})[\t\n\r ]*)</g, "><")

export const sanitizeSVGString = (svg: string): string => {
    const prepared = stripLeadingSvgCorruption(removeKnownMetadataBlocks(svg))
    const purified = DOMPurify.sanitize(prepared, PURIFY_CONFIG)
    return stripDanglingMetadataText(purified)
}

export const sanitizeSVG = (input: Buffer | string): Buffer => {
    const svg = typeof input === "string" ? input : input.toString("utf8")
    return Buffer.from(sanitizeSVGString(svg), "utf8")
}

/** True when the file contains sanitizable cruft and cleaning would change it. Ignores cosmetic-only normalization. */
export const svgNeedsSanitization = (input: Buffer | string): boolean => {
    const original = typeof input === "string" ? input : input.toString("utf8")
    if (!containsSanitizableCruft(original)) {
        return false
    }
    return sanitizeSVGString(original) !== original
}

export const isLikelySVG = (data: Buffer, contentType?: string | null): boolean => {
    if (contentType === SVG_CONTENT_TYPE) {
        return true
    }
    const head = data.subarray(0, 512).toString("utf8")
    return /<svg[\s/>]/i.test(head) || /<\?xml/i.test(head)
}
