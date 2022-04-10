import { expect } from "chai"
import { describe, it } from "mocha"
import { Image } from "../models/Image"
import { LicenseURL } from "../models/LicenseURL"
import { UUID } from "../models/UUID"
import { validateImage } from "./validateImage"
const VALID: Image = {
    attribution: "Rufus T. Firefly",
    contributor: "president@freedonia.free",
    created: "2022-01-15T22:08:43.135Z",
    general: "8f901db5-84c1-4dc0-93ba-2300eeddf4ab",
    license: "https://creativecommons.org/licenses/by/4.0/",
    specific: "1ee65cf3-53db-4a52-9960-a9f7093d845d",
    sponsor: "Mrs. Teasdale",
}
describe("validateImage", () => {
    const test = (name: string, value: Image, valid: boolean, normalized?: boolean) => {
        describe(`for ${name}`, () => {
            it(`should ${valid ? "not " : ""}throw if it's not expected to be normalized`, () => {
                if (valid) {
                    validateImage(value)
                } else {
                    expect(() => validateImage(value)).to.throw
                }
            })
            it(`should ${valid && normalized ? "not " : ""}throw if it's expected to be normalized`, () => {
                if (valid && normalized) {
                    validateImage(value, true)
                } else {
                    expect(() => validateImage(value, true)).to.throw
                }
            })
        })
    }
    test("a valid record with all fields", VALID, true, true)
    test("a record with a CC-BY license and no attribution", { ...VALID, attribution: undefined }, false)
    test("a record with non-normalized attribution text", { ...VALID, attribution: " Rufus  T.  Firefly " }, true)
    test(
        "a record with a PDM license and no attribution",
        { ...VALID, attribution: undefined, license: "https://creativecommons.org/publicdomain/mark/1.0/" },
        true,
        true,
    )
    test(
        "a record with a CC0 license and no attribution",
        { ...VALID, attribution: undefined, license: "https://creativecommons.org/publicdomain/zero/1.0/" },
        true,
        true,
    )
    test("a record with no creation timestamp", { ...VALID, created: undefined as unknown as string }, false)
    test("a record with no general node UUID", { ...VALID, general: undefined }, true, true)
    test("a record with an invalid general node UUID", { ...VALID, general: "foo" }, false)
    test(
        "a record with a non-normalized general node UUID",
        { ...VALID, general: "8F901DB5-84C1-4DC0-93BA-2300EEDDF4AB" },
        true,
    )
    test("a record with no license", { ...VALID, license: undefined as unknown as LicenseURL }, false)
    test("a record with an invalid license", { ...VALID, license: "foo" as unknown as LicenseURL }, false)
    test("a record with no specific node UUID", { ...VALID, specific: undefined as unknown as UUID }, false)
    test("a record with an invalid specific node UUID", { ...VALID, specific: "foo" }, false)
    test(
        "a record with a non-normalized specific node UUID",
        { ...VALID, specific: "1EE65CF3-53DB-4A52-9960-A9F7093D845D" },
        true,
    )
    test("a record with no sponsor", { ...VALID, sponsor: undefined }, true, true)
    test("a record with non-normalized sponsor text", { ...VALID, sponsor: " Mrs.  Teasdale " }, true)
    test("an empty object", {} as unknown as Image, false)
    test("a null value", null as unknown as Image, false)
})
