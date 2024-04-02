import { describe, expect, it } from "vitest"
import { LEGACY_LICENSE_URLS } from "../constants/LEGACY_LICENSE_URLS"
import { VALID_LICENSE_URLS } from "../constants/VALID_LICENSE_URLS"
import { isLicenseURL } from "./isLicenseURL"
describe("isLicenseURL", () => {
    const test = (value: unknown, expected: boolean) => {
        it(`should determine that ${JSON.stringify(value)} is${expected ? "" : " not"} a license URL.`, () => {
            const actual = isLicenseURL(value)
            expect(actual).to.equal(expected)
        })
    }
    LEGACY_LICENSE_URLS.forEach(url => test(url, true))
    VALID_LICENSE_URLS.forEach(url => test(url, true))
    test("", false)
    test({}, false)
})
