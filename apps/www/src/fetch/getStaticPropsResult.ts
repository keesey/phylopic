import { ErrorFetchResult, NotFoundFetchResult } from "@phylopic/utils-api"
import { GetStaticPropsResult } from "next"
const getStaticPropsResult = (result: ErrorFetchResult | NotFoundFetchResult): GetStaticPropsResult<never> => {
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
