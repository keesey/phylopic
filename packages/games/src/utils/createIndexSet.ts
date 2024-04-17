export const createIndexSet = (size: number) => new Set<number>(new Array(size).fill(null).map((_, index) => index))
