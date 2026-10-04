import { describe, expect, it } from "vitest"
import { buildAttributionDisplaySegments } from "./attributionDisplaySegments.js"
import { formatCollectionAttribution, formatImageSetAttributionQuote } from "./formatAttribution.js"

describe("formatCollectionAttribution", () => {
    it("states when attribution is not required", () => {
        expect(
            formatCollectionAttribution([
                {
                    _links: { license: { href: "https://creativecommons.org/publicdomain/mark/1.0/" } },
                },
            ]),
        ).toBe("Attribution is not required.")
    })

    it("formats a single attributed image", () => {
        const text = formatCollectionAttribution([
            {
                attribution: "Jane Doe",
                _links: { license: { href: "https://creativecommons.org/licenses/by/4.0/" } },
                _embedded: { specificNode: { names: [[{ text: "Homo sapiens" }]] } },
            },
        ])
        expect(text).toContain("Attribution is required")
        expect(text).toContain("Jane Doe")
        expect(text).not.toContain("Homo sapiens") // nomina omitted when there is only one attribution line
    })

    it("diagram quote omits required preamble", () => {
        const quote = formatImageSetAttributionQuote([
            {
                attribution: "Jane Doe",
                _links: { license: { href: "https://creativecommons.org/licenses/by/4.0/" } },
            },
        ])
        expect(quote).toBe("Silhouette image is by Jane Doe.")
        expect(quote).not.toContain("Attribution is required")
    })

    it("display segments use short nomina and italic scientific", () => {
        const segments = buildAttributionDisplaySegments([
            {
                attribution: "Jane Doe",
                _links: { license: { href: "https://creativecommons.org/licenses/by/4.0/" } },
                _embedded: {
                    specificNode: {
                        names: [
                            [
                                { class: "scientific", text: "Homo" },
                                { class: "scientific", text: "sapiens" },
                                { class: "citation", text: "Linnaeus 1758" },
                            ],
                        ],
                    },
                },
            },
            {
                attribution: "John Smith",
                _links: { license: { href: "https://creativecommons.org/licenses/by/4.0/" } },
                _embedded: {
                    specificNode: {
                        names: [
                            [
                                { class: "scientific", text: "Pan" },
                                { class: "scientific", text: "troglodytes" },
                                { class: "citation", text: "Blumenbach 1775" },
                            ],
                        ],
                    },
                },
            },
        ])
        expect(segments?.some(s => s.italic && s.text === "Homo")).toBe(true)
        expect(JSON.stringify(segments)).not.toContain("Linnaeus")
    })

    it("diagram quote is null when attribution is optional", () => {
        expect(
            formatImageSetAttributionQuote([
                {
                    _links: { license: { href: "https://creativecommons.org/publicdomain/mark/1.0/" } },
                },
            ]),
        ).toBeNull()
    })
})
