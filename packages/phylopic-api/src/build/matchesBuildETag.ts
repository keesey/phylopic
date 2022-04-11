import BUILD from "./BUILD"
import parseETags from "../utils/http/parseETags"
export const matchesBuildETag = (value: string | undefined) => {
    const buildValue = BUILD.toString(36)
    const parsedValues = parseETags(value)
    if (!parsedValues.length) {
        return false
    }
    return parsedValues.some(parsedValue => parsedValue.tag === buildValue)
}
export default matchesBuildETag
