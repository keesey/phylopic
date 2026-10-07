/**
 * Paul Tol qualitative and discrete-rainbow palettes for diagrams.
 * @see https://personal.sron.nl/~pault/ (Colour schemes, 2021)
 */

/** Named Tol palettes exposed for categorical / multi-series diagrams. */
export type TolColorScheme =
    | "darkRainbow"
    | "rainbow"
    | "bright"
    | "highContrast"
    | "vibrant"
    | "muted"
    | "mediumContrast"
    | "pale"
    | "dark"
    | "light"

/** Discrete rainbow (23 map colours); do not interpolate. */
export const TOL_DISCRETE_RAINBOW_23 = [
    "#E8ECFB",
    "#D9CCE3",
    "#D1BBD7",
    "#CAACCB",
    "#BA8DB4",
    "#AE76A3",
    "#AA6F9E",
    "#994F88",
    "#882E72",
    "#1965B0",
    "#437DBF",
    "#5289C7",
    "#6195CF",
    "#7BAFDE",
    "#4EB265",
    "#90C987",
    "#CAE0AB",
    "#F7F056",
    "#F7CB45",
    "#F6C141",
    "#F4A736",
    "#F1932D",
    "#EE8026",
] as const

/** Skip pale violets on white backgrounds (Tol: discrete rainbow for lines). */
export const TOL_DISCRETE_RAINBOW_ON_WHITE = TOL_DISCRETE_RAINBOW_23.slice(8)

/** Darker discrete-rainbow subset for branches on white (drops pale blues/yellows; adds deep reds). */
export const TOL_DISCRETE_RAINBOW_DARK = [
    "#882E72",
    "#994F88",
    "#1965B0",
    "#437DBF",
    "#5289C7",
    "#6195CF",
    "#4EB265",
    "#F4A736",
    "#F1932D",
    "#EE8026",
    "#E8601C",
    "#DC050C",
    "#A5170E",
    "#72190E",
    "#42150A",
] as const

const TOL_BRIGHT = [
    "#4477AA",
    "#EE6677",
    "#228833",
    "#CCBB44",
    "#66CCEE",
    "#AA3377",
    "#BBBBBB",
] as const

const TOL_HIGH_CONTRAST = ["#004488", "#DDAA33", "#BB5566"] as const

const TOL_VIBRANT = [
    "#EE7733",
    "#0077BB",
    "#33BBEE",
    "#EE3377",
    "#CC3311",
    "#009988",
    "#BBBBBB",
] as const

const TOL_MUTED = [
    "#CC6677",
    "#332288",
    "#DDCC77",
    "#117733",
    "#88CCEE",
    "#882255",
    "#44AA99",
    "#999933",
    "#AA4499",
] as const

const TOL_MEDIUM_CONTRAST = [
    "#6699CC",
    "#004488",
    "#EECC66",
    "#994455",
    "#997700",
    "#EE99AA",
] as const

const TOL_PALE = ["#BBCCEE", "#CCEEFF", "#CCDDAA", "#EEEEBB", "#FFCCCC", "#DDDDDD"] as const

const TOL_DARK = ["#222255", "#225555", "#225522", "#666633", "#663333", "#555555"] as const

const TOL_LIGHT = [
    "#77AADD",
    "#EE8866",
    "#EEDD88",
    "#FFAABB",
    "#99DDFF",
    "#44BB99",
    "#BBCC33",
    "#AAAA00",
    "#DDDDDD",
] as const

const SCHEME_COLORS: Record<TolColorScheme, readonly string[]> = {
    darkRainbow: TOL_DISCRETE_RAINBOW_DARK,
    rainbow: TOL_DISCRETE_RAINBOW_ON_WHITE,
    bright: TOL_BRIGHT,
    highContrast: TOL_HIGH_CONTRAST,
    vibrant: TOL_VIBRANT,
    muted: TOL_MUTED,
    mediumContrast: TOL_MEDIUM_CONTRAST,
    pale: TOL_PALE,
    dark: TOL_DARK,
    light: TOL_LIGHT,
}

/** Hex colours for a Tol scheme (fixed order; cycle with {@link tolColorAtIndex}). */
export const tolColorPalette = (scheme: TolColorScheme = "darkRainbow"): readonly string[] =>
    SCHEME_COLORS[scheme]

/** Pick a colour by series index; wraps when index exceeds palette length. */
export const tolColorAtIndex = (index: number, scheme: TolColorScheme = "darkRainbow"): string => {
    const palette = tolColorPalette(scheme)
    if (palette.length === 0) {
        return "#888888"
    }
    const i = ((index % palette.length) + palette.length) % palette.length
    return palette[i]!
}

const gcd = (a: number, b: number): number => {
    let x = Math.abs(a)
    let y = Math.abs(b)
    while (y) {
        const t = y
        y = x % y
        x = t
    }
    return x
}

/**
 * Stride through a Tol palette so consecutive **angular** slots (neighbours on the rim) land on
 * distant swatches. For gradient palettes (e.g. darkRainbow), sequential indices look alike.
 */
export const tolPaletteStrideForCount = (slotCount: number, paletteLength: number): number => {
    if (paletteLength <= 1 || slotCount <= 1) {
        return 1
    }
    const target = Math.floor(paletteLength / 2) || 1
    for (let delta = 0; delta < paletteLength; delta++) {
        for (const sign of [1, -1] as const) {
            const s = ((target + sign * delta) % paletteLength + paletteLength) % paletteLength
            if (s === 0) {
                continue
            }
            if (gcd(s, paletteLength) === 1) {
                return s
            }
        }
    }
    return 1
}

/** Palette index for the `angularSlotIndex`-th clade when walking the rim with {@link tolPaletteStrideForCount}. */
export const tolPaletteIndexAtAngularSlot = (
    angularSlotIndex: number,
    slotCount: number,
    paletteLength: number,
): number => {
    if (paletteLength <= 0) {
        return 0
    }
    const stride = tolPaletteStrideForCount(slotCount, paletteLength)
    return ((angularSlotIndex * stride) % paletteLength + paletteLength) % paletteLength
}

export const tolColorAtAngularSlot = (
    angularSlotIndex: number,
    slotCount: number,
    scheme: TolColorScheme = "darkRainbow",
): string => {
    const palette = tolColorPalette(scheme)
    const idx = tolPaletteIndexAtAngularSlot(angularSlotIndex, slotCount, palette.length)
    return palette[idx] ?? "#888888"
}

export type TolColorByAngleItem = Readonly<{
    id: string
    /** Mean bearing on the tip circle (radians). */
    angleRad: number
}>

/** Assign Tol colours sorted by rim angle so adjacent clades on the circle stay visually distinct. */
export const assignTolColorsByAngle = (
    items: readonly TolColorByAngleItem[],
    scheme: TolColorScheme = "darkRainbow",
): Map<string, string> => {
    const sorted = [...items].sort((a, b) => a.angleRad - b.angleRad)
    const out = new Map<string, string>()
    sorted.forEach((item, i) => {
        out.set(item.id, tolColorAtAngularSlot(i, sorted.length, scheme))
    })
    return out
}
