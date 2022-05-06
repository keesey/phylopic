import { extractQueryString, parseQueryString } from "@phylopic/utils/dist/http"
import { URL } from "@phylopic/utils/dist/models/types"
const getBuildFromURL = (url: URL) => {
    const { build } = parseQueryString(extractQueryString(url))
    return (build && parseInt(build, 10)) || null
}
export default getBuildFromURL
