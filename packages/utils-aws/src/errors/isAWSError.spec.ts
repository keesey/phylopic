import { describe, expect, it } from "vitest"
import { isAWSError } from "./isAWSError"
describe("isAwSError", () => {
    it("should detect a valid error", () => {
        expect(isAWSError({ $metadata: { httpStatusCode: 200 } })).to.equal(true)
    })
    it("should detect an invalid error", () => {
        expect(isAWSError({ $metadata: {} })).to.equal(false)
    })
    it("should detect null as invalid", () => {
        expect(isAWSError(null)).to.equal(false)
    })
})
