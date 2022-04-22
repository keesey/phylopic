import CORS_HEADERS from "./CORS_HEADERS"
const createRedirectHeaders = (href: string) => ({
    ...CORS_HEADERS,
    "cache-control": "public, max-age=60, stale-while-revalidate=86400",
    location: (process.env.PHYLOPIC_API_ENDPOINT ?? "") + href,
})
export default createRedirectHeaders
