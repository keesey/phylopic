const isDefined = <T>(x: T | null | undefined): x is NonNullable<T> => x !== undefined && x !== null
export default isDefined
