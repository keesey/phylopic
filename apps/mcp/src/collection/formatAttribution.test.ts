import { describe, expect, it } from "vitest"
import { formatCollectionAttribution } from "./formatAttribution.js"

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
})
