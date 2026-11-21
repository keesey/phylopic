const escAttr = (s: string): string =>
    s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

/** Safe fragment id for `url(#…)` (letters, digits, hyphen, underscore). */
export const svgFilterId = (base: string): string =>
    `tint-${base.replace(/[^a-zA-Z0-9_-]/g, "_")}`

/**
 * Recolor a monochrome silhouette {@code <image>} using its alpha: flood fill + SourceAlpha composite.
 */
export const svgAlphaTintFilterDef = (filterId: string, color: string): string =>
    `<filter id="${escAttr(filterId)}" color-interpolation-filters="sRGB"><feFlood flood-color="${escAttr(color)}" result="flood"/><feComposite in="flood" in2="SourceAlpha" operator="in"/></filter>`

export const svgAlphaTintFilterRef = (filterId: string): string => `url(#${filterId})`
