import BUILD from "../build/BUILD"
import createETagCacheHeaders from "./createETagCacheHeaders"
const CACHE_PER_BUILD_HEADERS = createETagCacheHeaders(BUILD.toString(36))
export default CACHE_PER_BUILD_HEADERS
