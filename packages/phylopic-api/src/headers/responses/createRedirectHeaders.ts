import CACHE_PER_BUILD_HEADERS from "./CACHE_PER_BUILD_HEADERS"
import CORS_HEADERS from "./CORS_HEADERS"
const createRedirectHeaders = (href: string) => ({
    ...CACHE_PER_BUILD_HEADERS,
    ...CORS_HEADERS,
    "access-control-allow-headers": "accept,authorization",
    location: (process.env.PHYLOPIC_API_ENDPOINT ?? "") + href,
})
export default createRedirectHeaders
