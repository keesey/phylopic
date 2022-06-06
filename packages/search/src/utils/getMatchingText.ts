export const getMatchingText = (matches?: readonly string[], normalizedText?: string) => {
    if (!normalizedText) {
        return ""
    }
    if (matches?.includes(normalizedText)) {
        return normalizedText
    }
    return (
        (matches &&
            Array.from(matches)
                .sort()
                .find(value => value.startsWith(normalizedText))) ??
        ""
    )
}
export default getMatchingText
