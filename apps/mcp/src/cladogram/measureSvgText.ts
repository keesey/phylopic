import { createCanvas } from "canvas"
import { isVernacularNewickLabel, type SvgLabelFont } from "@phylopic/diagrams"

export type MeasuredLabel = Readonly<{ width: number; height: number }>

/** Measure label box for layout (same font as final SVG text). */
export const measureNewickLabel = (
    label: string,
    font: SvgLabelFont = { family: "Georgia, serif", size: 12, italic: true },
): MeasuredLabel => {
    const canvas = createCanvas(1, 1)
    const ctx = canvas.getContext("2d")
    const primary = font.family.split(",")[0]!.trim().replace(/"/g, "")
    const italic = !isVernacularNewickLabel(label) && font.italic
    ctx.font = `${italic ? "italic " : ""}${font.size}px ${primary}`
    const m = ctx.measureText(label)
    const ascent = m.actualBoundingBoxAscent ?? font.size * 0.8
    const descent = m.actualBoundingBoxDescent ?? font.size * 0.2
    return { width: m.width, height: ascent + descent }
}
