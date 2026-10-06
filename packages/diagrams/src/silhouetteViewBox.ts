export type ViewBoxSize = Readonly<{ width: number; height: number }>

export type SilhouettePlacement = Readonly<{
    x: number
    y: number
    width: number
    height: number
}>

/**
 * Scale vector artwork to fit in a square (uniform “meet”), centered horizontally,
 * flush to the **bottom** of the slot. Returns coordinates relative to the slot’s top-left.
 */
export const bottomAlignArtInSquareSlot = (slotSize: number, art: ViewBoxSize): SilhouettePlacement => {
    if (!(slotSize > 0 && art.width > 0 && art.height > 0)) {
        return { x: 0, y: 0, width: slotSize, height: slotSize }
    }
    const scale = Math.min(slotSize / art.width, slotSize / art.height)
    const width = art.width * scale
    const height = art.height * scale
    return {
        x: (slotSize - width) / 2,
        y: slotSize - height,
        width,
        height,
    }
}

/** @deprecated Prefer explicit {@link bottomAlignArtInSquareSlot} for external SVG `<image>` refs. */
export const PHYLOPIC_THUMBNAIL_PRESERVE_ASPECT = "xMidYMax meet" as const

/** Parse `viewBox="minX minY width height"` from SVG text. */
export const parseSvgViewBox = (svgText: string): ViewBoxSize | null => {
    const m = svgText.match(
        /viewBox=["']([\d.eE+\-]+)\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)["']/,
    )
    if (!m) {
        return null
    }
    const width = Number(m[3])
    const height = Number(m[4])
    if (!(width > 0 && height > 0)) {
        return null
    }
    return { width, height }
}

/** Fixed square layout slot; artwork is bottom-aligned inside via {@link bottomAlignArtInSquareSlot}. */
export const silhouetteSquareSlot = (slotSize: number): ViewBoxSize => ({
    width: slotSize,
    height: slotSize,
})

export const fetchSvgViewBoxSize = async (
    vectorUrl: string,
    fetchFn: typeof fetch = fetch,
): Promise<ViewBoxSize | null> => {
    const res = await fetchFn(vectorUrl)
    if (!res.ok) {
        return null
    }
    return parseSvgViewBox(await res.text())
}
