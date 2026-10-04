import type { LicenseFlags } from "@phylopic/api-models"
import { isExtendedLicenseURL, LICENSE_NAMES, type ExtendedLicenseURL } from "@phylopic/utils"
import { phylopicImagePageUrl } from "../cladogram/phylopicWebUrls.js"
import { buildAttributionDisplaySegments } from "./attributionDisplaySegments.js"
import type { ImageForAttribution } from "./formatAttributionAggregate.js"
import {
    estimateWrappedFooterHeight,
    wrapAttributionSegments,
    wrapPlainTextLines,
    wrappedAttributionTextSvg,
    plainLinesToSvg,
} from "./diagramFooterLayout.js"
import type { ImageSetUsage } from "./describeImageSetUsage.js"

export const PHYLOPIC_GENERATOR = "PhyloPic.org"

/** Matches PhyloPic www body text (Roboto), not Georgia used for taxon labels in diagrams. */
export const DIAGRAM_FOOTER_FONT_FAMILY = "Roboto, sans-serif"

export const DIAGRAM_FOOTER_STYLE = `@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400&display=swap');
.phylopic-diagram-footer { font-family: ${DIAGRAM_FOOTER_FONT_FAMILY}; font-size: 12px; fill: #333333; }
.phylopic-diagram-footer a { text-decoration: underline; }`

export type DiagramAttributionMode = "full_text" | "permalink"

export type DiagramPublicationInput = {
    usage: ImageSetUsage
    /** Silhouette records with embedded specificNode (for short-name footer). */
    images?: readonly ImageForAttribution[]
    /** Max width for wrapped footer text (px); default 640. */
    footerWidth?: number
    licenseUrl?: string
    attributionMode?: DiagramAttributionMode
    attributionUrl?: string
    userAttributionNote?: string
    diagramTitle?: string
    imageUuids: readonly string[]
}

export type DiagramPublication = {
    licenseUrl: ExtendedLicenseURL
    licenseName: string
    licenseLinePlain: string
    /** Full attribution for metadata / desc (not footer display). */
    attributionPlain: string | null
    footerStyleCss: string
    footerSvgFragment: string
    /** Approximate footer block height including license line. */
    footerBlockHeight: number
    metadataXml: string
    descText: string
}

export const licenseFlagsFromUrl = (href: string): LicenseFlags => {
    switch (href) {
        case "https://creativecommons.org/licenses/by-nc-sa/3.0/":
            return { by: true, nc: true, sa: true, v4: false }
        case "https://creativecommons.org/licenses/by-nc-sa/4.0/":
            return { by: true, nc: true, sa: true, v4: true }
        case "https://creativecommons.org/licenses/by-nc/3.0/":
            return { by: true, nc: true, sa: false, v4: false }
        case "https://creativecommons.org/licenses/by-nc/4.0/":
            return { by: true, nc: true, sa: false, v4: true }
        case "https://creativecommons.org/licenses/by-sa/3.0/":
            return { by: true, nc: false, sa: true, v4: false }
        case "https://creativecommons.org/licenses/by-sa/4.0/":
            return { by: true, nc: false, sa: true, v4: true }
        case "https://creativecommons.org/licenses/by/3.0/":
            return { by: true, nc: false, sa: false, v4: false }
        case "https://creativecommons.org/licenses/by/4.0/":
            return { by: true, nc: false, sa: false, v4: true }
        default:
            return { by: false, nc: false, sa: false, v4: false }
    }
}

export const isLicenseAtLeastAsRestrictiveAs = (combined: LicenseFlags, chosen: LicenseFlags): boolean => {
    if (combined.nc && !chosen.nc) {
        return false
    }
    if (combined.sa && !chosen.sa) {
        return false
    }
    if (combined.by && !chosen.by) {
        return false
    }
    if (!combined.by && chosen.by) {
        return false
    }
    return true
}

export const resolveDiagramLicenseUrl = (
    combinedLicenseUrl: string,
    override?: string,
): ExtendedLicenseURL => {
    if (!isExtendedLicenseURL(combinedLicenseUrl)) {
        throw new Error(`Invalid combined license URL: ${combinedLicenseUrl}`)
    }
    if (!override || override === combinedLicenseUrl) {
        return combinedLicenseUrl
    }
    if (!isExtendedLicenseURL(override)) {
        throw new Error(`Invalid diagram license URL: ${override}`)
    }
    const combinedFlags = licenseFlagsFromUrl(combinedLicenseUrl)
    const chosenFlags = licenseFlagsFromUrl(override)
    if (!isLicenseAtLeastAsRestrictiveAs(combinedFlags, chosenFlags)) {
        throw new Error(
            "Diagram license cannot be more permissive than combinedLicenseUrl from the included silhouettes.",
        )
    }
    return override
}

const escapeXml = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export const buildDiagramLicenseLinePlain = (licenseUrl: ExtendedLicenseURL): string => {
    const name = LICENSE_NAMES[licenseUrl]
    return `This image is available under the ${name} license.`
}

const licenseLineSvg = (licenseUrl: ExtendedLicenseURL, y: number) => {
    const name = escapeXml(LICENSE_NAMES[licenseUrl])
    const href = escapeXml(licenseUrl)
    return `<text class="phylopic-diagram-footer" x="0" y="${y}"><tspan>This image is available under the </tspan><a xlink:href="${href}"><tspan>${name}</tspan></a><tspan> license.</tspan></text>`
}

const linkAttributionSvg = (url: string, startY: number) => {
    const href = escapeXml(url)
    return `<text class="phylopic-diagram-footer" x="0" y="${startY}"><tspan>For attribution, see </tspan><a xlink:href="${href}"><tspan>${href}</tspan></a><tspan>.</tspan></text>`
}

const metadataAttribution = (
    usage: ImageSetUsage,
    mode: DiagramAttributionMode,
    attributionUrl: string | undefined,
    userNote: string | undefined,
): string | null => {
    if (!usage.attributionRequired) {
        return userNote?.trim() ?? null
    }
    if (mode === "permalink") {
        if (!attributionUrl) {
            throw new Error("attributionUrl is required when using a permalink attribution link.")
        }
        const base = `For attribution, see ${attributionUrl}.`
        return userNote?.trim() ? `${base}\n${userNote.trim()}` : base
    }
    const base = usage.attributionQuote
    if (!base) {
        return userNote?.trim() ?? null
    }
    return userNote?.trim() ? `${base}\n${userNote.trim()}` : base
}

export const buildDiagramPublication = (input: DiagramPublicationInput): DiagramPublication => {
    const mode = input.attributionMode ?? "full_text"
    const footerWidth = input.footerWidth ?? 640
    const licenseUrl = resolveDiagramLicenseUrl(input.usage.combinedLicenseUrl, input.licenseUrl)
    const licenseName = LICENSE_NAMES[licenseUrl]
    const licenseLinePlain = buildDiagramLicenseLinePlain(licenseUrl)

    const attributionPlain = metadataAttribution(
        input.usage,
        mode,
        input.attributionUrl,
        input.userAttributionNote,
    )

    const footerParts: string[] = [licenseLineSvg(licenseUrl, 0)]
    let attributionLineCount = 0

    if (input.usage.attributionRequired) {
        if (mode === "permalink") {
            footerParts.push(linkAttributionSvg(input.attributionUrl!, 16))
            attributionLineCount = 1
        } else if (input.images?.length) {
            const segments = buildAttributionDisplaySegments(input.images)
            if (segments) {
                const wrapped = wrapAttributionSegments(segments, footerWidth)
                attributionLineCount = wrapped.length
                footerParts.push(wrappedAttributionTextSvg(wrapped, 16))
            }
        }
    }
    if (input.userAttributionNote?.trim()) {
        const noteLines = wrapPlainTextLines(input.userAttributionNote.trim(), footerWidth)
        const noteY = 16 + estimateWrappedFooterHeight(attributionLineCount) + (attributionLineCount > 0 ? 4 : 0)
        footerParts.push(plainLinesToSvg(noteLines, noteY))
        attributionLineCount += noteLines.length
    }

    const footerBlockHeight =
        14 + (attributionLineCount > 0 ? 4 + estimateWrappedFooterHeight(attributionLineCount) : 0)

    const footerSvgFragment = `<defs><style type="text/css"><![CDATA[${DIAGRAM_FOOTER_STYLE}]]></style></defs><g id="phylopic-diagram-footer">${footerParts.join("")}</g>`

    const imageSources = input.imageUuids.map(uuid => phylopicImagePageUrl(uuid))
    const metadataXml = buildDiagramMetadataXml({
        diagramTitle: input.diagramTitle,
        licenseUrl,
        imageSources,
        attributionPlain,
        generator: PHYLOPIC_GENERATOR,
    })

    const descParts = [licenseLinePlain]
    if (attributionPlain) {
        descParts.push(attributionPlain)
    }
    descParts.push(`Generator: ${PHYLOPIC_GENERATOR}.`)

    return {
        licenseUrl,
        licenseName,
        licenseLinePlain,
        attributionPlain,
        footerStyleCss: DIAGRAM_FOOTER_STYLE,
        footerSvgFragment,
        footerBlockHeight,
        metadataXml,
        descText: descParts.join("\n\n"),
    }
}

type MetadataInput = {
    diagramTitle?: string
    licenseUrl: ExtendedLicenseURL
    imageSources: readonly string[]
    attributionPlain: string | null
    generator: string
}

const buildDiagramMetadataXml = ({
    diagramTitle,
    licenseUrl,
    imageSources,
    attributionPlain,
    generator,
}: MetadataInput): string => {
    const title = escapeXml(diagramTitle ?? "PhyloPic diagram")
    const rights = escapeXml(licenseUrl)
    const generatorEscaped = escapeXml(generator)
    const attributionBlock =
        attributionPlain ?
            `<dc:description>${escapeXml(attributionPlain)}</dc:description>`
        :   ""
    const sources = imageSources
        .map(href => `<dc:source rdf:resource="${escapeXml(href)}"/>`)
        .join("")
    return `<metadata id="phylopic-diagram-metadata">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
           xmlns:dc="http://purl.org/dc/elements/1.1/"
           xmlns:cc="http://creativecommons.org/ns#">
    <cc:Work rdf:about="">
      <dc:title>${title}</dc:title>
      <dc:creator>${generatorEscaped}</dc:creator>
      <cc:license rdf:resource="${rights}"/>
      ${attributionBlock}
      ${sources}
    </cc:Work>
  </rdf:RDF>
</metadata>`
}
