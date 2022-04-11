export interface ParsedETag {
    tag: string
    weak: boolean
}
export const parseETag = (eTag: string) => {
    return {
        tag: eTag.replace(/^W\//, ""),
        weak: eTag.startsWith("W/"),
    }
}
export default parseETag
