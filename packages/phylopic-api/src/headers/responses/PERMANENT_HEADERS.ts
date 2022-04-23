const PERMANENT_HEADERS = {
    "cache-control": `public, max-age=${365 * 24 * 60 * 60}, stale-while-revalidate=${365 * 24 * 60 * 60}, immutable`,
}
export default PERMANENT_HEADERS
