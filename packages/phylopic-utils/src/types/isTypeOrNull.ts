export const isTypeOrNull = <T>(x: unknown, isType: (x: unknown) => x is T): x is T | null => x === null || isType(x)
export default isTypeOrNull
