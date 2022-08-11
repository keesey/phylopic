import prepareBoolean from "./prepareBoolean"
const prepareValue = (x: any) => {
    if (typeof x === "boolean") {
        return prepareBoolean(x)
    }
    return x
}
export default prepareValue
