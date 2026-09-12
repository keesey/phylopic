import { describe, expect, it } from "vitest"
import { isAWSError } from "./isAWSError"

describe("isAWSError", () => {
    const test = (value: unknown, expected: boolean) => {
        it(`should determine that ${JSON.stringify(value)} is${expected ? "" : " not"} an AWSError.`, () => {
            expect(isAWSError(value)).to.equal(expected)
        })
    }
    test({ $metadata: { httpStatusCode: 404 } }, true)
    test({ $metadata: { httpStatusCode: 200 } }, true)
    test({ $metadata: { httpStatusCode: "404" } }, false)
    test({ $metadata: {} }, false)
    test({ $metadata: null }, false)
    test({}, false)
    test(null, false)
    test(undefined, false)
    test("error", false)
    test(42, false)
})
