import APIError from "../errors/APIError"
const checkContentType = (contentType: string | undefined, mediaType: string) => {
    const parts = mediaType.split(/,\s*/g).map(part => part.split(";", 1)[0])
    if (!contentType || !parts.some(part => part === contentType || part === "*/*")) {
        throw new APIError(415, [
            {
                developerMessage: `Invalid "content-type" header: "${contentType ?? ""}". Should match "${mediaType}".`,
                field: "content-type",
                type: "UNSUPPORTED_MEDIA_TYPE",
                userMessage: "Could not load data due to an error in the request.",
            },
        ])
    }
}
export default checkContentType
