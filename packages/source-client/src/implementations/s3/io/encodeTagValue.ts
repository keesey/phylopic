const ACCEPTABLE_CHARACTERS = /^[A-Za-z0-9 _.:/=+-]$/
const encodeCharacter = (c: string) => {
    if (ACCEPTABLE_CHARACTERS.test(c)) {
        return c
    }
    return "@" + c.charCodeAt(0).toString(16) + "@"
}
export const encodeTagValue = (value: string | null) => {
    if (!value) {
        return null
    }
    return value.split("").map(encodeCharacter).join("")
}
export default encodeTagValue
