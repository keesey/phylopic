import { describe, expect, it } from "vitest"
import { LEGACY_LICENSE_URLS } from "../constants/LEGACY_LICENSE_URLS"
import { VALID_LICENSE_URLS } from "../constants/VALID_LICENSE_URLS"
import { isLegacyLicenseURL } from "./isLegacyLicenseURL"
describe("isLegacyLicenseURL", () => {
    const test = (value: unknown, expected: boolean) => {
        it(`should determine that ${JSON.stringify(value)} is${expected ? "" : " not"} a legacy license URL.`, () => {
            const actual = isLegacyLicenseURL(value)
            expect(actual).to.equal(expected)
        })
    }
    LEGACY_LICENSE_URLS.forEach(url => test(url, true))
    VALID_LICENSE_URLS.forEach(url => test(url, false))
    test("", false)
    test({}, false)
})
