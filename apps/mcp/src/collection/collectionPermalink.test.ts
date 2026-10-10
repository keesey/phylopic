import { describe, expect, it } from "vitest"
import { parsePermalinkHash, permalinkUrlFromHash } from "./collectionPermalink.js"

const HASH = "6acda313ef1bbf24a6827068e581de3f18877636308ad6a4ac12adf6fd8319f5"

describe("parsePermalinkHash", () => {
    it("accepts a full permalink URL", () => {
        expect(parsePermalinkHash(`https://www.phylopic.org/permalinks/${HASH}`)).toBe(HASH)
    })

    it("accepts a bare hash", () => {
        expect(parsePermalinkHash(HASH)).toBe(HASH)
    })

    it("rejects invalid input", () => {
        expect(() => parsePermalinkHash("not-a-hash")).toThrow()
    })
})

describe("permalinkUrlFromHash", () => {
    it("builds www URL", () => {
        expect(permalinkUrlFromHash(HASH)).toBe(`https://www.phylopic.org/permalinks/${HASH}`)
    })
})
