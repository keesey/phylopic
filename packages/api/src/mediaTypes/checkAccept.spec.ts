import { DATA_MEDIA_TYPE } from "@phylopic/api-models"
import { expect } from "chai"
import { describe, it } from "mocha"
import APIError from "../errors/APIError"
import checkAccept from "./checkAccept"
const test = (accept: string, expectError: boolean) => {
    let error: APIError | null = null
    try {
        checkAccept(accept, DATA_MEDIA_TYPE)
    } catch (e) {
        if (e instanceof APIError) {
            error = e
        } else {
            throw e
        }
    }
    if (expectError) {
        const actual = {
            data: error ? error.data : undefined,
            httpCode: error ? error.httpCode : undefined,
        }
        expect(actual).to.deep.equal({
            data: [
                {
                    developerMessage: `Invalid "accept" header: "${accept}". Should allow "application/vnd.phylopic.v2+json".`,
                    field: "accept",
                    type: "DEFAULT_4XX",
                    userMessage: "Could not load data due to an error in the request.",
                },
            ],
            httpCode: 406,
        })
    } else {
        expect(error).to.equal(null)
    }
}
describe("mediaTypes/checkAccept", () => {
    it("should allow universal matches", () => {
        test("*/*", false)
    })
    it("should allow partial matches", () => {
        test("application/*", false)
    })
    it("should allow full matches", () => {
        test("application/vnd.phylopic.v2+json", false)
    })
    it("should allow universal weighted matches", () => {
        test("*/*;q=0.9", false)
    })
    it("should allow partial weighted matches", () => {
        test("application/*;q=0.9", false)
    })
    it("should allow full weighted matches", () => {
        test("application/vnd.phylopic.v2+json;q=0.9", false)
    })
    it("should allow a list of types with a universal match", () => {
        test("*/*, text/html, text/plain", false)
    })
    it("should allow a list of types with a partial match", () => {
        test("application/*, text/html, text/plain", false)
    })
    it("should allow a list of types with a full match", () => {
        test("application/vnd.phylopic.v2+json, text/html, text/plain", false)
    })
    it("should not allow partial mismatches", () => {
        test("text/*", true)
    })
    it("should not allow full mismatches", () => {
        test("text/vnd.phylopic.v2+json", true)
    })
    it("should not allow partial weighted mismatches", () => {
        test("text/*;q=0.9", true)
    })
    it("should not allow full weighted mismatches", () => {
        test("text/vnd.phylopic.v2+json;q=0.9", true)
    })
    it("should not allow a list of types with no match", () => {
        test("text/*, image/vnd.phylopic.v2+json, application/json", true)
    })
})
