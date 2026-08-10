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

export const containsRemovableThreats = (svg: string): boolean => REMOVABLE_THREAT_PATTERNS.some(pattern => pattern.test(svg))

export const sanitizeSVGString = (svg: string): string => DOMPurify.sanitize(svg, PURIFY_CONFIG)

export const sanitizeSVG = (input: Buffer | string): Buffer => {
    const svg = typeof input === "string" ? input : input.toString("utf8")
    return Buffer.from(sanitizeSVGString(svg), "utf8")
}

/** True when the file contains removable threats and DOMPurify would change it. Ignores cosmetic-only normalization. */
export const svgNeedsSanitization = (input: Buffer | string): boolean => {
    const original = typeof input === "string" ? input : input.toString("utf8")
    if (!containsRemovableThreats(original)) {
        return false
    }
    return sanitizeSVGString(original) !== original
}

export const isLikelySVG = (data: Buffer, contentType?: string | null): boolean => {
    if (contentType === SVG_CONTENT_TYPE) {
        return true
    }
    const head = data.subarray(0, 512).toString("utf8").trimStart()
    return head.startsWith("<") && (head.includes("<svg") || head.includes("<?xml"))
}
