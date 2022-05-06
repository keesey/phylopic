import { extractQueryString, parseQueryString, URL } from "@phylopic/utils"
const getBuildFromURL = (url: URL) => {
    const { build } = parseQueryString(extractQueryString(url))
    return (build && parseInt(build, 10)) || null
}
export default getBuildFromURL
