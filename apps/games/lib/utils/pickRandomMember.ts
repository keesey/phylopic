export function pickRandomMember<T>(candidates: ReadonlySet<T>) {
    if (candidates.size === 0) {
        return null
    }
    const array = Array.from(candidates)
    return array[Math.floor(Math.random() * array.length)]
}
