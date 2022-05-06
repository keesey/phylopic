import { createSearch, parseQueryString } from "@phylopic/utils/dist/http"
import { URL } from "@phylopic/utils/dist/models/types"
const addBuildToURL = (url: URL, build: number) => {
    const [base, queryString] = url.split("?", 2)
    const query = parseQueryString(queryString)
    return (
        base +
        createSearch({
            ...query,
            build,
        })
    )
}
export default addBuildToURL
