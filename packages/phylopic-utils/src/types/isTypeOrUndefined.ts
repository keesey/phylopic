export const isTypeOrUndefined = <T>(x: unknown, isType: (x: unknown) => x is T): x is T | undefined =>
    x === undefined || isType(x)
export default isTypeOrUndefined
