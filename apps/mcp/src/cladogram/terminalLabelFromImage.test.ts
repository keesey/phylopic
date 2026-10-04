import type { ImageWithEmbedded } from "@phylopic/api-models"
import { describe, expect, it } from "vitest"
import { terminalLabelFromImage } from "./terminalLabelFromImage.js"

describe("terminalLabelFromImage", () => {
    it("omits citation parts from the specific node nomen", () => {
        const image = {
            uuid: "82152f31-1fec-4baa-a11e-94cd0a93e08f",
            _embedded: {
                specificNode: {
                    names: [
                        [
                            { class: "scientific", text: "Tachyglossus aculeatus" },
                            { class: "citation", text: "Shaw 1792" },
                        ],
                    ],
                },
            },
        } as unknown as ImageWithEmbedded
        expect(terminalLabelFromImage(image)).toBe("Tachyglossus aculeatus")
    })
})
