import type { ImageForAttribution } from "../collection/formatAttribution.js"

/** Minimal PhyloPic image stub for attribution / publication tests. */
export const attributionTestImage = (
    licenseHref: string,
    extra: Partial<Omit<ImageForAttribution, "_links">> = {},
): ImageForAttribution =>
    ({
        _links: { license: { href: licenseHref } },
        ...extra,
    }) as ImageForAttribution
