import { GetStaticPropsResult } from "next"
import { ErrorFetchResult, NotFoundFetchResult } from "./fetchResult"
const getStaticPropsResult = (
    result: ErrorFetchResult | NotFoundFetchResult,
): GetStaticPropsResult<never> => {
    switch (result.status) {
        case "error": {
            throw result.error
        }
        case "notFound":
        default: {
            return { notFound: true }
        }
    }
}
export default getStaticPropsResult
