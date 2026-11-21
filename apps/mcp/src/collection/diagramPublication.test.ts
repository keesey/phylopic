import { describe, expect, it } from "vitest"
import { attributionTestImage } from "../testFixtures/attributionImage.js"
import { describeImageSetUsage } from "./describeImageSetUsage.js"
import {
    buildDiagramPublication,
    diagramWidthForPublication,
    resolveDiagramLicenseUrl,
} from "./diagramPublication.js"

describe("resolveDiagramLicenseUrl", () => {
    it("accepts combined license by default", () => {
        expect(
            resolveDiagramLicenseUrl("https://creativecommons.org/licenses/by-nc-sa/4.0/"),
        ).toBe("https://creativecommons.org/licenses/by-nc-sa/4.0/")
    })

    it("allows a more restrictive override", () => {
        expect(
            resolveDiagramLicenseUrl(
                "https://creativecommons.org/licenses/by/4.0/",
                "https://creativecommons.org/licenses/by-nc/4.0/",
            ),
        ).toBe("https://creativecommons.org/licenses/by-nc/4.0/")
    })

    it("rejects a more permissive override", () => {
        expect(() =>
            resolveDiagramLicenseUrl(
                "https://creativecommons.org/licenses/by-nc/4.0/",
                "https://creativecommons.org/licenses/by/4.0/",
            ),
        ).toThrow(/more permissive/)
    })
})

describe("buildDiagramPublication", () => {
    it("includes license line and full attribution text when required", () => {
        const images = [
            attributionTestImage("https://creativecommons.org/licenses/by/4.0/", { attribution: "Artist" }),
        ]
        const usage = describeImageSetUsage(images)
        const pub = buildDiagramPublication({
            usage,
            images,
            footerWidth: 400,
            imageUuids: ["060f03a9-fafd-4d08-81d1-b8f82080573f"],
            diagramTitle: "Test tree",
        })
        expect(pub.licenseLinePlain).toContain("Attribution 4.0 International")
        expect(pub.attributionPlain).toContain("Artist")
        expect(pub.attributionPlain).not.toContain("Attribution is required, and may be given as:")
        expect(pub.footerSvgFragment).not.toContain("Attribution is required, and may be given as:")
        expect(pub.footerSvgFragment).toContain("phylopic-diagram-footer")
        expect(pub.footerSvgFragment).toContain("Roboto")
        expect(pub.metadataXml).toContain("PhyloPic.org")
        expect(pub.metadataXml).toContain("060f03a9-fafd-4d08-81d1-b8f82080573f")
    })

    it("uses short attribution URL for permalink mode", () => {
        const usage = describeImageSetUsage([
            attributionTestImage("https://creativecommons.org/licenses/by/4.0/", { attribution: "Artist" }),
        ])
        const url = "https://www.phylopic.org/permalinks/" + "a".repeat(64)
        const pub = buildDiagramPublication({
            usage,
            attributionMode: "permalink",
            attributionUrl: url,
            imageUuids: ["060f03a9-fafd-4d08-81d1-b8f82080573f"],
        })
        expect(pub.attributionPlain).toBe(`For attribution, see ${url}.`)
        expect(pub.footerSvgFragment).toContain("For attribution, see")
        expect(pub.footerMinWidth).toBeGreaterThan(400)
    })

    it("diagramWidthForPublication expands narrow layouts for long permalinks", () => {
        const url = "https://www.phylopic.org/permalinks/" + "a".repeat(64)
        const usage = describeImageSetUsage([
            attributionTestImage("https://creativecommons.org/licenses/by/4.0/", { attribution: "Artist" }),
        ])
        const pub = buildDiagramPublication({
            usage,
            attributionMode: "permalink",
            attributionUrl: url,
            footerWidth: 200,
            imageUuids: ["060f03a9-fafd-4d08-81d1-b8f82080573f"],
        })
        expect(diagramWidthForPublication(300, 24, pub)).toBeGreaterThan(300)
        expect(diagramWidthForPublication(300, 24, pub)).toBe(pub.footerMinWidth + 48)
    })
})
