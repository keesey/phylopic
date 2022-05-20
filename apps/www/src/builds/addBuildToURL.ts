import { createSearch, parseQueryString, URL } from "@phylopic/utils"
const addBuildToURL = (url: URL, build: number) => {
    const [base, queryString] = url.split("?", 2)
    const query = parseQueryString(queryString ?? "")
    return (
        base +
        createSearch({
            ...query,
            build,
        })
    )
}
export default addBuildToURL
