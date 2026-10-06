import { isVernacularNewickLabel, type SvgLabelFont, DEFAULT_SVG_LABEL_FONT } from "./newickLabelStyle.js"

export type MeasuredLabel = Readonly<{ width: number; height: number }>

const measureWithCanvas = (
    label: string,
    font: SvgLabelFont,
    canvas: { getContext(type: "2d"): CanvasRenderingContext2D | null },
): MeasuredLabel => {
    const ctx = canvas.getContext("2d")
    if (!ctx) {
        return { width: label.length * font.size * 0.55, height: font.size * 1.2 }
    }
    const primary = font.family.split(",")[0]!.trim().replace(/"/g, "")
    const italic = !isVernacularNewickLabel(label) && font.italic
    ctx.font = `${italic ? "italic " : ""}${font.size}px ${primary}`
    const m = ctx.measureText(label)
    const ascent = m.actualBoundingBoxAscent ?? font.size * 0.8
    const descent = m.actualBoundingBoxDescent ?? font.size * 0.2
    return { width: m.width, height: ascent + descent }
}

/** Measure label box for layout (browser or Node canvas). */
export const measureLabel = (
    label: string,
    font: SvgLabelFont = DEFAULT_SVG_LABEL_FONT,
): MeasuredLabel => {
    if (typeof document !== "undefined") {
        const canvas = document.createElement("canvas")
        return measureWithCanvas(label, font, canvas)
    }
    return { width: label.length * font.size * 0.55, height: font.size * 1.2 }
}
