import { ErrorFetchResult, NotFoundFetchResult } from "@phylopic/utils-api"
import { GetStaticPropsResult } from "next"
const getStaticPropsResult = (result: ErrorFetchResult | NotFoundFetchResult): GetStaticPropsResult<never> => {
    switch (result.status) {
        case "notFound": {
            return { notFound: true }
        }
        case "error": {
            throw result.error
        }
        default: {
            console.error(result)
            throw new Error("Invalid status.")
        }
    }
}
export default getStaticPropsResult
