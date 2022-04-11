import APIError from "../errors/APIError"
const checkAccept = (accept: string | undefined, mediaType: string) => {
    if (typeof accept !== "string") {
        // No Accept header.
        return true
    }
    const type = `${mediaType.split("/", 1)[0]}/*`
    const parts = accept.split(/,\s*/g).map(part => part.split(";", 1)[0])
    if (!parts.some(part => part === mediaType || part === "*/*" || part === type)) {
        throw new APIError(406, [
            {
                developerMessage: `Invalid "accept" header: "${accept}". Should allow "${mediaType}".`,
                field: "accept",
                type: "DEFAULT_4XX",
                userMessage: "Could not load data due to an error in the request.",
            },
        ])
    }
}
export default checkAccept
