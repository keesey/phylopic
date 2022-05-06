import { GetStaticPropsResult } from "next"
import { ErrorFetchResult, NotFoundFetchResult, RedirectFetchResult } from "./fetchResult"
const getStaticPropsResult = (
    result: RedirectFetchResult | ErrorFetchResult | NotFoundFetchResult,
): GetStaticPropsResult<never> => {
    switch (result.status) {
        case "error": {
            throw result.error
        }
        case "redirect": {
            return {
                redirect: {
                    destination: result.destination,
                    permanent: result.permanent,
                },
            }
        }
        case "notFound":
        default: {
            return { notFound: true }
        }
    }
}
export default getStaticPropsResult
