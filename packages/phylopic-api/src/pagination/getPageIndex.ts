import APIError from "../errors/APIError"
const getPageIndex = (page: string, userMessage = "There was a problem with a request for data.") => {
    const index = parseInt(page, 10)
    if (!isFinite(index) || index < 0) {
        throw new APIError(400, [
            {
                developerMessage: "Invalid page index. Must be a nonnegative integer, or omitted.",
                field: "page",
                type: "BAD_REQUEST_PARAMETERS",
                userMessage,
            },
        ])
    }
    return index
}
export default getPageIndex
