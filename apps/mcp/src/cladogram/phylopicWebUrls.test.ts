import { describe, expect, it } from "vitest"
import { phylopicImagePageUrl, phylopicNodePageUrl } from "./phylopicWebUrls.js"

describe("phylopicWebUrls", () => {
    it("builds node and image page URLs", () => {
        const uuid = "f96400c5-cab0-4a39-a878-62097ad2e620"
        expect(phylopicNodePageUrl(uuid)).toBe(`https://www.phylopic.org/nodes/${uuid}`)
        expect(phylopicImagePageUrl(uuid)).toBe(`https://www.phylopic.org/images/${uuid}`)
    })
})
