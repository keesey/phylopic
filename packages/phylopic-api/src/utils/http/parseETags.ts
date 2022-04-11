import parseETag from "./parseETag"
export const parseETags = (value: string | undefined) => {
    if (!value || value === "*") {
        return []
    }
    return value.split(/,\s+/g).map(parseETag)
}
export default parseETags
