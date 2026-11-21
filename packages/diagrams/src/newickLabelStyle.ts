/** Typography for Newick labels (verbatim text; not PhyloPic node titles). */

/** Vernacular labels in Newick are often plain lowercase (e.g. `birds`). */
export const isVernacularNewickLabel = (label: string): boolean =>
    label === label.toLowerCase() && /[a-z]/.test(label)

export type SvgLabelFont = Readonly<{
    family: string
    size: number
    italic: boolean
}>

export const DEFAULT_SVG_LABEL_FONT: SvgLabelFont = {
    family: "Georgia, serif",
    size: 12,
    italic: true,
}

export const svgLabelFontAttrs = (
    label: string,
    font: SvgLabelFont = DEFAULT_SVG_LABEL_FONT,
): { fontFamily: string; fontSize: number; fontStyle?: "italic" } => ({
    fontFamily: font.family,
    fontSize: font.size,
    ...(isVernacularNewickLabel(label) ? {} : { fontStyle: "italic" as const }),
})
