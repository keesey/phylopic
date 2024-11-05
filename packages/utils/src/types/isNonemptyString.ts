export const isNonemptyString = (x: unknown): x is string => typeof x === "string" && x !== ""
