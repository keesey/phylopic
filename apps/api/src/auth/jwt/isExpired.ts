const isExpired = (exp: number | undefined, now: number) => {
    if (typeof exp !== "number") {
        return true
    }
    return exp * 1000 <= now
}
export default isExpired
