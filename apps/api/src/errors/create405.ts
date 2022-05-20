import APIError from "./APIError"
const create405 = () =>
    new APIError(405, [
        {
            developerMessage: "Invalid method.",
            type: "DEFAULT_4XX",
            userMessage: "An invalid request was made.",
        },
    ])
export default create405
