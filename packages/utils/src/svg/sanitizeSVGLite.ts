const SVG_CONTENT_TYPE = "image/svg+xml"

export const REMOVABLE_THREAT_PATTERNS: readonly RegExp[] = [
    /<script[\s/>]/i,
    /<foreignObject[\s/>]/i,
    /<iframe[\s/>]/i,
    /\s(on[a-z]+|formaction)\s*=/i,
    /javascript:/i,
    /data:text\/html/i,
]

const ADOBE_PGF_BLOCK_PATTERN = /<i:pgf\b[\s\S]*?<\/i:pgf>/gi

/** Base64-like text nodes left behind when metadata elements are removed. */
const DANGLING_METADATA_TEXT_PATTERN = />[\t\n\r ]*(?:[A-Za-z0-9+/=][A-Za-z0-9+/=\t\n\r ]{79,})[\t\n\r ]*</

/** CDATA closing fragments left before the root element by broken Adobe Illustrator exports. */
const LEADING_CDATA_FRAGMENT_PATTERN = /^[\t\n\r ]*(?:\]\]?&gt;|\]\]>|\]>)+[\t\n\r ]*/

export const containsRemovableThreats = (svg: string): boolean =>
    REMOVABLE_THREAT_PATTERNS.some(pattern => pattern.test(svg))

export const hasLeadingSvgCorruption = (svg: string): boolean => LEADING_CDATA_FRAGMENT_PATTERN.test(svg)

export const removeKnownMetadataBlocks = (svg: string): string => svg.replace(ADOBE_PGF_BLOCK_PATTERN, "")

export const stripLeadingSvgCorruption = (svg: string): string => svg.replace(LEADING_CDATA_FRAGMENT_PATTERN, "")

export const stripDanglingMetadataText = (svg: string): string =>
    svg.replace(/>([\t\n\r ]*(?:[A-Za-z0-9+/=][A-Za-z0-9+/=\t\n\r ]{79,})[\t\n\r ]*)</g, "><")

/** Regex-based removal of common SVG threats (no DOM parser; safe for Lambda). */
export const stripThreatMarkup = (svg: string): string =>
    svg
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<script[\s/>][^>]*\/?>/gi, "")
        .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
        .replace(/<foreignObject[\s/>][^>]*\/?>/gi, "")
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
        .replace(/<iframe[\s/>][^>]*\/?>/gi, "")
        .replace(/\s(on[a-z]+|formaction)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
        .replace(/\sjavascript:[^"'\\s]*/gi, "")
        .replace(/\sdata:text\/html[^"'\\s]*/gi, "")

/** Sanitize SVG without DOMPurify (for serverless runtimes that cannot load jsdom). */
export const sanitizeSVGLiteString = (svg: string): string =>
    stripDanglingMetadataText(stripThreatMarkup(stripLeadingSvgCorruption(removeKnownMetadataBlocks(svg))))

export const sanitizeSVGLite = (input: Buffer | string): Buffer => {
    const svg = typeof input === "string" ? input : input.toString("utf8")
    return Buffer.from(sanitizeSVGLiteString(svg), "utf8")
}

export const isLikelySVG = (data: Buffer, contentType?: string | null): boolean => {
    if (contentType === SVG_CONTENT_TYPE) {
        return true
    }
    const head = data.subarray(0, 512).toString("utf8")
    return /<svg[\s/>]/i.test(head) || /<\?xml/i.test(head)
}
