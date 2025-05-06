import { describe, expect, it } from "vitest"
import { Tag } from "../types/Tag"
import { normalizeTag } from "./normalizeTag"
describe("normalizeTag", () => {
    const test = (value: string, expected: Tag | null) => {
        it(`should convert ${JSON.stringify(value)} to ${JSON.stringify(expected)}`, () => {
            const actual = normalizeTag(value)
            expect(actual).to.deep.equal(expected)
        })
    }
    test("female", "female")
    test("FeMaLe", "female")
    test("   female   ", "female")
    test("\n\t\fone\n\t\ftwo\n\t\f", "one two")
    test("¡Hëllø Wørld! ☺ ♠ ñ € → ∞ ≠ ≤ ß æ œ ç 漢字 🌍 🦕", "h-ll- w-rld")
    test("☺-♠-ñ-€-→-∞-≠-≤-ß-æ-œ-ç-漢字-🌍-🦕", null)
    test("", null)
    test("    ", null)
    test("a", null)
})
