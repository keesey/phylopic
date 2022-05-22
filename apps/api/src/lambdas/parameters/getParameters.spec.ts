import { expect } from "chai"
import { describe, it } from "mocha"
import getParameters from "./getParameters.js"
const test =
    <T>(params: { [name: string]: string }, names: ReadonlyArray<Lowercase<string> & keyof T>, expected: Partial<T>) =>
    () => {
        const actual = getParameters<T>(params, names)
        expect(actual).to.deep.equal(expected)
    }
describe("lambda/parameters/getParameters", () => {
    it("should work with no parameters", test<{ foo: string; bar: string }>({}, ["foo", "bar"], {}))
    it("should work with no requested parameters", test<{ foo: string; bar: string }>({ foo: "a", bar: "b" }, [], {}))
    it(
        "should work with one of the requested parameters",
        test<{ foo: string; bar: string }>({ foo: "a" }, ["foo", "bar"], { foo: "a" }),
    )
    it(
        "should work with both of the requested parameters",
        test({ foo: "a", bar: "b" }, ["foo", "bar"], { foo: "a", bar: "b" }),
    )
    it(
        "should work when only one requested parameter is present",
        test<{ accept: string; "if-match": string; range: string }>(
            { range: "items=0-11" },
            ["accept", "if-match", "range"],
            { range: "items=0-11" },
        ),
    )
})
