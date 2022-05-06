const getMatchingText = (matches?: readonly string[], normalizedText?: string) => {
    if (!normalizedText) {
        return ""
    }
    if (matches?.includes(normalizedText)) {
        return normalizedText
    }
    return matches?.find(value => value.startsWith(normalizedText)) ?? ""
}
export default getMatchingText
