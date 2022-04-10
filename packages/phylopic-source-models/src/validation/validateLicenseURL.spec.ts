import { expect } from "chai"
import { describe, it } from "mocha"
import { LEGACY_LICENSE_URLS } from "../constants/LEGACY_LICENSE_URLS"
import { VALID_LICENSE_URLS } from "../constants/VALID_LICENSE_URLS"
import { LicenseURL } from "../models/LicenseURL"
import { validateLicenseURL } from "./validateLicenseURL"
describe("validateLicenseURL", () => {
    const test = (value: LicenseURL, valid: boolean) => {
        it(`should ${valid ? "not " : ""}throw for ${JSON.stringify(value)}`, () => {
            if (valid) {
                validateLicenseURL(value)
            } else {
                expect(() => validateLicenseURL(value)).to.throw
            }
        })
    }
    LEGACY_LICENSE_URLS.forEach(url => test(url, true))
    VALID_LICENSE_URLS.forEach(url => test(url, true))
    test("https://creativecommons.org/licenses/by-nc-sa/1.0/" as unknown as LicenseURL, false)
    test("foo" as unknown as LicenseURL, false)
    test("" as unknown as LicenseURL, false)
})
