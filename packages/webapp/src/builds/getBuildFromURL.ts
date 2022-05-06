import { parseQueryString, URL } from "@phylopic/utils"
const getBuildFromURL = (url: URL) => {
    const { build } = parseQueryString(extractQueryString(url))
    return parseInt(build, 10) || null
}
export default getBuildFromURL
