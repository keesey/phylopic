import decodeJWT from "./decodeJWT"
const isJWTExpired = (token: string | null, now = NaN) => {
    if (!token) {
        return false
    }
    const payload = decodeJWT(token)
    if (typeof payload?.exp !== "number") {
        return false
    }
    if (isNaN(now)) {
        now = new Date().valueOf()
    }
    return payload.exp * 1000 <= now
}
export default isJWTExpired
