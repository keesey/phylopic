import DOMPurify from "isomorphic-dompurify"
import {
    containsRemovableThreats,
    hasLeadingSvgCorruption,
    isLikelySVG,
    removeKnownMetadataBlocks,
    stripDanglingMetadataText,
    stripLeadingSvgCorruption,
} from "./sanitizeSVGLite"

const PURIFY_CONFIG = {
    USE_PROFILES: { svg: true, svgFilters: true },
} as const

const DANGLING_METADATA_TEXT_PATTERN = />[\t\n\r ]*(?:[A-Za-z0-9+/=][A-Za-z0-9+/=\t\n\r ]{79,})[\t\n\r ]*</

const containsSanitizableCruft = (svg: string): boolean =>
    containsRemovableThreats(svg) ||
    hasLeadingSvgCorruption(svg) ||
    /<i:pgf[\s/>]/i.test(svg) ||
    DANGLING_METADATA_TEXT_PATTERN.test(svg)

export { containsRemovableThreats, hasLeadingSvgCorruption, isLikelySVG } from "./sanitizeSVGLite"

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
