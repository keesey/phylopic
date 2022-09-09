export const decodeTagValue = (value: string | null) => {
    if (!value) {
        return null
    }
    let result = ""
    let index = 0
    let code = ""
    let inCode = false
    while (index < value.length) {
        const c = value.charAt(index)
        if (c === "@") {
            if (inCode) {
                result += String.fromCharCode(parseInt(code, 16))
                inCode = false
                code = ""
            } else {
                inCode = true
            }
        } else if (inCode) {
            code += c
        } else {
            result += c
        }
        index++
    }
    return result
}
export default decodeTagValue
