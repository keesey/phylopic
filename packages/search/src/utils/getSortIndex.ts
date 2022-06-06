export const getSortIndex = (value: string | undefined, query: string) => {
    if (typeof value !== "string") {
        return Number.MAX_SAFE_INTEGER
    }
    const index = value.indexOf(query)
    if (index < 0) {
        return Number.MAX_SAFE_INTEGER
    }
    return index
}
export default getSortIndex
