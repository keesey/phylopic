import { expect } from "chai"
import { describe, it } from "mocha"
import filterLicenses from "./filterLicenses"
import { LicenseComponentFilter } from "./LicenseComponentFilter"
import { LicenseURL } from "./LicenseURL"
describe("licenses/filterLicenses", () => {
    const TESTS: [LicenseComponentFilter[], LicenseURL[]][] = [
        [["by", "nc", "sa"], ["https://creativecommons.org/licenses/by-nc-sa/3.0/"]],
        [["by", "nc", "-sa"], ["https://creativecommons.org/licenses/by-nc/3.0/"]],
        [
            ["by", "nc"],
            ["https://creativecommons.org/licenses/by-nc/3.0/", "https://creativecommons.org/licenses/by-nc-sa/3.0/"],
        ],
        [["by", "-nc", "sa"], ["https://creativecommons.org/licenses/by-sa/3.0/"]],
        [
            ["by", "-nc", "-sa"],
            ["https://creativecommons.org/licenses/by/4.0/", "https://creativecommons.org/licenses/by/3.0/"],
        ],
        [
            ["by", "-nc"],
            [
                "https://creativecommons.org/licenses/by/4.0/",
                "https://creativecommons.org/licenses/by/3.0/",
                "https://creativecommons.org/licenses/by-sa/3.0/",
            ],
        ],
        [
            ["by", "sa"],
            ["https://creativecommons.org/licenses/by-nc-sa/3.0/", "https://creativecommons.org/licenses/by-sa/3.0/"],
        ],
        [
            ["by", "-sa"],
            [
                "https://creativecommons.org/licenses/by/4.0/",
                "https://creativecommons.org/licenses/by/3.0/",
                "https://creativecommons.org/licenses/by-nc/3.0/",
            ],
        ],
        [
            ["by"],
            [
                "https://creativecommons.org/licenses/by/4.0/",
                "https://creativecommons.org/licenses/by/3.0/",
                "https://creativecommons.org/licenses/by-nc/3.0/",
                "https://creativecommons.org/licenses/by-nc-sa/3.0/",
                "https://creativecommons.org/licenses/by-sa/3.0/",
            ],
        ],
        [["-by", "nc", "sa"], []],
        [["-by", "nc", "-sa"], []],
        [["-by", "nc"], []],
        [["-by", "-nc", "sa"], []],
        [
            ["-by", "-nc", "-sa"],
            [
                "https://creativecommons.org/publicdomain/zero/1.0/",
                "https://creativecommons.org/publicdomain/mark/1.0/",
            ],
        ],
        [
            ["-by", "-nc"],
            [
                "https://creativecommons.org/publicdomain/zero/1.0/",
                "https://creativecommons.org/publicdomain/mark/1.0/",
            ],
        ],
        [["-by", "sa"], []],
        [
            ["-by", "-sa"],
            [
                "https://creativecommons.org/publicdomain/zero/1.0/",
                "https://creativecommons.org/publicdomain/mark/1.0/",
            ],
        ],
        [
            ["-by"],
            [
                "https://creativecommons.org/publicdomain/zero/1.0/",
                "https://creativecommons.org/publicdomain/mark/1.0/",
            ],
        ],
        [["nc", "sa"], ["https://creativecommons.org/licenses/by-nc-sa/3.0/"]],
        [["nc", "-sa"], ["https://creativecommons.org/licenses/by-nc/3.0/"]],
        [
            ["nc"],
            ["https://creativecommons.org/licenses/by-nc/3.0/", "https://creativecommons.org/licenses/by-nc-sa/3.0/"],
        ],
        [["-nc", "sa"], ["https://creativecommons.org/licenses/by-sa/3.0/"]],
        [
            ["-nc", "-sa"],
            [
                "https://creativecommons.org/publicdomain/zero/1.0/",
                "https://creativecommons.org/publicdomain/mark/1.0/",
                "https://creativecommons.org/licenses/by/4.0/",
                "https://creativecommons.org/licenses/by/3.0/",
            ],
        ],
        [
            ["-nc"],
            [
                "https://creativecommons.org/publicdomain/zero/1.0/",
                "https://creativecommons.org/publicdomain/mark/1.0/",
                "https://creativecommons.org/licenses/by/4.0/",
                "https://creativecommons.org/licenses/by/3.0/",
                "https://creativecommons.org/licenses/by-sa/3.0/",
            ],
        ],
        [
            ["sa"],
            ["https://creativecommons.org/licenses/by-nc-sa/3.0/", "https://creativecommons.org/licenses/by-sa/3.0/"],
        ],
        [
            ["-sa"],
            [
                "https://creativecommons.org/publicdomain/zero/1.0/",
                "https://creativecommons.org/publicdomain/mark/1.0/",
                "https://creativecommons.org/licenses/by/4.0/",
                "https://creativecommons.org/licenses/by/3.0/",
                "https://creativecommons.org/licenses/by-nc/3.0/",
            ],
        ],
        [
            [],
            [
                "https://creativecommons.org/publicdomain/zero/1.0/",
                "https://creativecommons.org/publicdomain/mark/1.0/",
                "https://creativecommons.org/licenses/by/4.0/",
                "https://creativecommons.org/licenses/by/3.0/",
                "https://creativecommons.org/licenses/by-nc/3.0/",
                "https://creativecommons.org/licenses/by-nc-sa/3.0/",
                "https://creativecommons.org/licenses/by-sa/3.0/",
            ],
        ],
    ]
    TESTS.forEach(([components, expected]) => {
        it(`should yield the expected licenses for${components.length ? "" : " no"} components${
            components.length ? ` ["${components.join('", "')}"]` : ""
        }`, () => {
            expect(filterLicenses(components)).to.deep.equal(expected)
        })
    })
})
