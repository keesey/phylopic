import { describe, expect, it } from "vitest"
import { getLicenseFlags } from "./getLicenseFlags.js"

const image = (licenseHref: string) =>
    ({
        _links: { license: { href: licenseHref } },
    }) as Parameters<typeof getLicenseFlags>[0][number]

describe("getLicenseFlags", () => {
    it("returns no flags for public domain", () => {
        expect(getLicenseFlags([image("https://creativecommons.org/publicdomain/mark/1.0/")])).toEqual({
            by: false,
            nc: false,
            sa: false,
            v4: false,
        })
    })

    it("combines flags across images", () => {
        expect(
            getLicenseFlags([
                image("https://creativecommons.org/licenses/by/4.0/"),
                image("https://creativecommons.org/licenses/by-nc-sa/3.0/"),
            ]),
        ).toEqual({ by: true, nc: true, sa: true, v4: true })
    })
})
