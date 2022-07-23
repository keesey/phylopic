const getBearerJWT = (authorization: string | undefined) => {
    if (!authorization) {
        throw 401
    }
    const match = authorization.match(/^Bearer\s+(.+)$/)
    if (!match) {
        throw 401
    }
    return match[1]
}
export default getBearerJWT
