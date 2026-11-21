import { getCombinedLicenseUrl, type ImageWithEmbedded } from "@phylopic/api-models"
import { LICENSE_NAMES, type ExtendedLicenseURL } from "@phylopic/utils"
import { imageSetAttributionRequired } from "./formatAttribution.js"

export const DIAGRAM_FOOTER_FONT_FAMILY = "Roboto, sans-serif"

export const DIAGRAM_FOOTER_STYLE = `@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400&display=swap');
.phylopic-diagram-footer { font-family: ${DIAGRAM_FOOTER_FONT_FAMILY}; font-size: 12px; fill: #333333; }
.phylopic-diagram-footer a { text-decoration: underline; }`

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")

export type CollectionDiagramFooter = Readonly<{
    footerSvgFragment: string
    footerBlockHeight: number
    metadataXml: string
    descText: string
}>

export const buildCollectionDiagramFooter = (input: {
    images: readonly ImageWithEmbedded[]
    collectionPageUrl: string
    diagramTitle: string
}): CollectionDiagramFooter => {
    const licenseUrl = getCombinedLicenseUrl(input.images) as ExtendedLicenseURL
    const licenseName = LICENSE_NAMES[licenseUrl] ?? licenseUrl
    const attributionRequired = imageSetAttributionRequired(input.images)
    const descText = `${input.diagramTitle} (${input.images.length} silhouettes).`
    const metadataXml = `<metadata><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about=""><dc:title xmlns:dc="http://purl.org/dc/elements/1.1/">${esc(input.diagramTitle)}</dc:title></rdf:Description></rdf:RDF></metadata>`

    const licenseLine = `<text class="phylopic-diagram-footer" x="0" y="0"><tspan>This image is available under the </tspan><a xlink:href="${esc(licenseUrl)}"><tspan>${esc(licenseName)}</tspan></a><tspan> license.</tspan></text>`
    const attributionLine = attributionRequired
        ? `<text class="phylopic-diagram-footer" x="0" y="16"><tspan>For attribution, see </tspan><a xlink:href="${esc(input.collectionPageUrl)}"><tspan>${esc(input.collectionPageUrl)}</tspan></a><tspan>.</tspan></text>`
        : ""
    const footerBlockHeight = attributionRequired ? 32 : 16
    const footerSvgFragment = `<defs><style type="text/css"><![CDATA[${DIAGRAM_FOOTER_STYLE}]]></style></defs><g id="phylopic-diagram-footer">${licenseLine}${attributionLine}</g>`

    return { footerSvgFragment, footerBlockHeight, metadataXml, descText }
}
