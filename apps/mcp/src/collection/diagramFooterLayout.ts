import { createCanvas } from "canvas"
import type { AttributionTextSegment } from "./attributionDisplaySegments.js"

const FOOTER_FONT_SIZE = 12
const FOOTER_FONT_FAMILY = "Roboto"
const LINE_HEIGHT = 14

const primaryFont = () => FOOTER_FONT_FAMILY

const measureSegment = (segment: AttributionTextSegment) => {
    const canvas = createCanvas(1, 1)
    const ctx = canvas.getContext("2d")
    ctx.font = `${segment.italic ? "italic " : ""}${FOOTER_FONT_SIZE}px ${primaryFont()}`
    return ctx.measureText(segment.text).width
}

export const wrapAttributionSegments = (
    segments: readonly AttributionTextSegment[],
    maxWidth: number,
): readonly (readonly AttributionTextSegment[])[] => {
    if (maxWidth <= 0) {
        return [segments]
    }
    const lines: AttributionTextSegment[][] = [[]]
    let lineWidth = 0

    const pushSegment = (segment: AttributionTextSegment) => {
        const w = measureSegment(segment)
        const line = lines[lines.length - 1]!
        if (line.length > 0 && lineWidth + w > maxWidth) {
            lines.push([])
            lineWidth = 0
            pushSegment(segment)
            return
        }
        line.push(segment)
        lineWidth += w
    }

    for (const segment of segments) {
        const words = segment.text.split(/(\s+)/)
        for (const word of words) {
            if (!word) continue
            pushSegment({ text: word, italic: segment.italic })
        }
    }
    return lines
}

export const segmentsToSvgTspans = (segments: readonly AttributionTextSegment[]) =>
    segments
        .map(s => {
            const inner = escapeXml(s.text)
            return s.italic ? `<tspan font-style="italic">${inner}</tspan>` : `<tspan>${inner}</tspan>`
        })
        .join("")

const escapeXml = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export const wrappedAttributionTextSvg = (
    lines: readonly (readonly AttributionTextSegment[])[],
    startY: number,
): string =>
    lines
        .map((line, index) => {
            const y = startY + index * LINE_HEIGHT
            const x = index === 0 ? 0 : 0
            const attrs = index === 0 ? `x="${x}" y="${y}"` : `x="${x}" y="${y}"`
            return `<text class="phylopic-diagram-footer" ${attrs}>${segmentsToSvgTspans(line)}</text>`
        })
        .join("")

export const estimateWrappedFooterHeight = (lineCount: number) =>
    lineCount > 0 ? (lineCount - 1) * LINE_HEIGHT + FOOTER_FONT_SIZE : 0

export const wrapPlainTextLines = (text: string, maxWidth: number): string[] => {
    const canvas = createCanvas(1, 1)
    const ctx = canvas.getContext("2d")
    ctx.font = `${FOOTER_FONT_SIZE}px ${primaryFont()}`
    const words = text.split(/\s+/)
    const lines: string[] = []
    let current = ""
    for (const word of words) {
        const next = current ? `${current} ${word}` : word
        if (ctx.measureText(next).width > maxWidth && current) {
            lines.push(current)
            current = word
        } else {
            current = next
        }
    }
    if (current) {
        lines.push(current)
    }
    return lines
}

export const plainLinesToSvg = (lines: readonly string[], startY: number, className = "phylopic-diagram-footer") =>
    lines
        .map((line, index) => {
            const y = startY + index * LINE_HEIGHT
            return `<text class="${className}" x="0" y="${y}"><tspan>${escapeXml(line)}</tspan></text>`
        })
        .join("")
