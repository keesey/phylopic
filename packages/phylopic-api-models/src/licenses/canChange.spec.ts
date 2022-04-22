import { expect } from "chai"
import { describe, it } from "mocha"
import { LicenseURL, ValidLicenseURL } from "phylopic-utils/src"
import canChange from "./canChange"
describe("licenses/canChange", () => {
    const test = (a: LicenseURL, b: ValidLicenseURL, permitted: boolean) => {
        it(`should${permitted ? "" : " not"} allow a change from '${a}' to '${b}'`, () => {
            const actual = canChange(a, b)
            expect(actual).to.equal(permitted)
        })
    }
    const TESTS: [LicenseURL, ValidLicenseURL, boolean][] = [
        [
            "https://creativecommons.org/publicdomain/zero/1.0/",
            "https://creativecommons.org/publicdomain/zero/1.0/",
            true,
        ],
        [
            "https://creativecommons.org/publicdomain/zero/1.0/",
            "https://creativecommons.org/publicdomain/mark/1.0/",
            false,
        ],
        ["https://creativecommons.org/publicdomain/zero/1.0/", "https://creativecommons.org/licenses/by/4.0/", false],
        [
            "https://creativecommons.org/publicdomain/mark/1.0/",
            "https://creativecommons.org/publicdomain/zero/1.0/",
            false,
        ],
        [
            "https://creativecommons.org/publicdomain/mark/1.0/",
            "https://creativecommons.org/publicdomain/mark/1.0/",
            true,
        ],
        ["https://creativecommons.org/publicdomain/mark/1.0/", "https://creativecommons.org/licenses/by/4.0/", false],
        ["https://creativecommons.org/licenses/by/4.0/", "https://creativecommons.org/publicdomain/zero/1.0/", true],
        ["https://creativecommons.org/licenses/by/4.0/", "https://creativecommons.org/publicdomain/mark/1.0/", false],
        ["https://creativecommons.org/licenses/by/4.0/", "https://creativecommons.org/licenses/by/4.0/", true],
        ["https://creativecommons.org/licenses/by-nc/3.0/", "https://creativecommons.org/publicdomain/zero/1.0/", true],
        [
            "https://creativecommons.org/licenses/by-nc/3.0/",
            "https://creativecommons.org/publicdomain/mark/1.0/",
            false,
        ],
        ["https://creativecommons.org/licenses/by-nc/3.0/", "https://creativecommons.org/licenses/by/4.0/", true],
        [
            "https://creativecommons.org/licenses/by-nc-sa/3.0/",
            "https://creativecommons.org/publicdomain/zero/1.0/",
            true,
        ],
        [
            "https://creativecommons.org/licenses/by-nc-sa/3.0/",
            "https://creativecommons.org/publicdomain/mark/1.0/",
            false,
        ],
        ["https://creativecommons.org/licenses/by-nc-sa/3.0/", "https://creativecommons.org/licenses/by/4.0/", true],
        ["https://creativecommons.org/licenses/by-sa/3.0/", "https://creativecommons.org/publicdomain/zero/1.0/", true],
        [
            "https://creativecommons.org/licenses/by-sa/3.0/",
            "https://creativecommons.org/publicdomain/mark/1.0/",
            false,
        ],
        ["https://creativecommons.org/licenses/by-sa/3.0/", "https://creativecommons.org/licenses/by/4.0/", true],
    ]
    TESTS.forEach(args => test(args[0], args[1], args[2]))
})
