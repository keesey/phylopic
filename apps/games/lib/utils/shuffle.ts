export const shuffle = <T>(array: readonly T[]): T[] => {
    return array
        .map(a => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map(a => a.value)
}
