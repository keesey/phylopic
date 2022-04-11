import parseETag from "./parseETag"
import parseETags from "./parseETags"
export const matchesETag = (value: string | undefined, eTag: string | undefined /*, weak = false*/) => {
    const parsedValues = parseETags(value)
    if (!parsedValues.length) {
        return false
    }
    const parsedETag = eTag ? parseETag(eTag) : null
    if (!parsedETag) {
        return false
    }
    return parsedValues.some(parsedValue => {
        // const w = weak || parsedValue.weak || parsedETag.weak;
        return parsedValue.tag === parsedETag.tag
    })
}
export default matchesETag
