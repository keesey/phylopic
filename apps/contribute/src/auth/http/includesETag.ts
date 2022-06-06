const includesETag = (ifNoneMatch: string | undefined, eTag: string | undefined) => {
    if (!ifNoneMatch || !eTag) {
        return false
    }
    const candidates = ifNoneMatch.trim().split(/s*,\s*/g)
    if (candidates.includes("*")) {
        return true
    }
    const eTags = candidates.map(candidate => candidate.replace(/^(W\/)?"/, "").replace(/"$/, ""))
    return eTags.includes(eTag)
}
export default includesETag
