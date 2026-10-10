import { shortenNomen, type Nomen } from "@phylopic/utils"
import {
    buildAttributionAggregate,
    type ImageForAttribution,
} from "./formatAttributionAggregate.js"

export type AttributionTextSegment = Readonly<{
    text: string
    italic?: boolean
}>

const nomenToSegments = (nomen: Nomen): readonly AttributionTextSegment[] =>
    shortenNomen(nomen).map(part => ({
        text: part.text,
        italic: part.class === "scientific",
    }))

const formatNominaSegments = (nomina: readonly Nomen[]): readonly AttributionTextSegment[] => {
    if (!nomina.length) {
        return []
    }
    const out: AttributionTextSegment[] = [{ text: " (" }]
    nomina.forEach((nomen, index) => {
        if (index > 0) {
            out.push({ text: ", " })
        }
        out.push(...nomenToSegments(nomen))
    })
    out.push({ text: ")" })
    return out
}

/** Footer attribution with short taxon names; scientific names marked italic for SVG. */
export const buildAttributionDisplaySegments = (
    images: readonly ImageForAttribution[],
): readonly AttributionTextSegment[] | null => {
    const agg = buildAttributionAggregate(images)
    if (!agg.attributionRequired) {
        return null
    }
    if (agg.attributionRequired && !agg.hasAttributions) {
        return [{ text: "Attribution must be given to Anonymous." }]
    }

    const segments: AttributionTextSegment[] = [
        {
            text: `Silhouette image${agg.imageCount === 1 ? "" : "s"} ${agg.imageCount === 1 ? "is" : "are"} by `,
        },
    ]

    agg.entries.forEach((entry, index, array) => {
        if (index > 0 && array.length + (agg.unattributed.length > 0 ? 1 : 0) > 2) {
            segments.push({ text: `${agg.separator} ` })
        } else if (index > 0 && agg.unattributed.length === 0 && index === array.length - 1) {
            segments.push({ text: " and " })
        } else if (index > 0) {
            segments.push({ text: " " })
        }
        segments.push({ text: entry.attribution })
        if (agg.entries.length > 1 || agg.unattributed.length > 0) {
            segments.push(...formatNominaSegments(entry.nomina))
        }
    })

    if (agg.unattributed.length > 0) {
        segments.push({
            text: `${agg.entries.length >= 2 ? `${agg.separator} ` : " "}and others`,
        })
        segments.push(...formatNominaSegments(agg.unattributed))
    }
    segments.push({ text: "." })
    return segments
}
