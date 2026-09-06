import CORS_HEADERS from "./CORS_HEADERS"
import PERMANENT_HEADERS from "./PERMANENT_HEADERS"
import TEMPORARY_HEADERS from "./TEMPORARY_HEADERS"
const createRedirectHeaders = (href: string, permanent: boolean) => ({
    ...CORS_HEADERS,
    ...(permanent ? PERMANENT_HEADERS : TEMPORARY_HEADERS),
    location: href,
})
export default createRedirectHeaders
