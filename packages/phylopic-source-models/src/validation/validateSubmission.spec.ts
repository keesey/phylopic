import { expect } from "chai"
import { describe, it } from "mocha"
import { LicenseURL } from "../models/LicenseURL"
import { NodeIdentifier } from "../models/NodeIdentifier"
import { Submission } from "../models/Submission"
import { validateSubmission } from "./validateSubmission"
const VALID: Submission = {
    attribution: "Rufus T. Firefly",
    contributor: "president@freedonia.free",
    created: "2022-01-15T22:08:43.135Z",
    general: {
        name: [
            {
                class: "scientific",
                text: "Pan-Biota",
            },
            {
                class: "vernacular",
                text: "Wagner 2004 [Wiemann & al. 2020]",
            },
        ],
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    specific: {
        name: [
            {
                class: "scientific",
                text: "Homo sapiens",
            },
            {
                class: "vernacular",
                text: "Linnaeus 1758",
            },
        ],
    },
    sponsor: "Mrs. Teasdale",
    uuid: "00000000-0000-0000-0000-000000000000",
}
describe("validateSubmission", () => {
    const test = (name: string, value: Submission, valid: boolean, normalized?: boolean) => {
        describe(`for ${name}`, () => {
            it(`should ${valid ? "not " : ""}throw if it's not expected to be normalized`, () => {
                if (valid) {
                    validateSubmission(value)
                } else {
                    expect(() => validateSubmission(value)).to.throw
                }
            })
            it(`should ${valid && normalized ? "not " : ""}throw if it's expected to be normalized`, () => {
                if (valid && normalized) {
                    validateSubmission(value, true)
                } else {
                    expect(() => validateSubmission(value, true)).to.throw
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
    test("a record with no general node identifier", { ...VALID, general: undefined }, true, true)
    test(
        "a record with an invalid general node identifier",
        { ...VALID, general: "foo" as unknown as NodeIdentifier },
        false,
    )
    test(
        "a record with a non-normalized general node identifier",
        {
            ...VALID,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            general: { ...VALID.general, name: [...VALID.general!.name, { class: "citation", text: "Extra Text" }] },
        },
        true,
    )
    test("a record with no license", { ...VALID, license: undefined as unknown as LicenseURL }, false)
    test("a record with an invalid license", { ...VALID, license: "foo" as unknown as LicenseURL }, false)
    test(
        "a record with no specific node identifier",
        { ...VALID, specific: undefined as unknown as NodeIdentifier },
        false,
    )
    test(
        "a record with an invalid specific node identifier",
        { ...VALID, specific: "foo" as unknown as NodeIdentifier },
        false,
    )
    test(
        "a record with a non-normalized specific node identifier",
        {
            ...VALID,
            specific: { ...VALID.specific, name: [...VALID.specific.name, { class: "citation", text: "Extra Text" }] },
        },
        true,
    )
    test("a record with no sponsor", { ...VALID, sponsor: undefined }, true, true)
    test("a record with non-normalized sponsor text", { ...VALID, sponsor: " Mrs.  Teasdale " }, true)
    test("a record with an invalid UUID", { ...VALID, uuid: "foo" }, false)
    test("a record with a non-normalized UUID", { ...VALID, uuid: "1EE65CF3-53DB-4A52-9960-A9F7093D845D" }, true)
    test("an empty object", {} as unknown as Submission, false)
    test("a null value", null as unknown as Submission, false)
})
