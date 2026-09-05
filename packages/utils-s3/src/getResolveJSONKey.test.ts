import { describe, expect, it } from "vitest"
import { getResolveJSONKey } from "./getResolveJSONKey"

describe("getResolveJSONKey", () => {
    it("builds a resolve JSON key", () => {
        expect(getResolveJSONKey(552, "gbif.org", "species", "12345")).toBe("552/resolve/gbif.org/species/12345.json")
    })

    it("encodes path segments in resolve identifiers", () => {
        expect(getResolveJSONKey(552, "example.org", "taxon", "a/b")).toBe("552/resolve/example.org/taxon/a%2Fb.json")
    })
})
