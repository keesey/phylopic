const isNumber = (x: unknown): x is number => typeof x === "number" && !isNaN(x)
export default isNumber
