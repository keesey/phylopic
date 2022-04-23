const TEMPORARY_HEADERS = {
    "cache-control": `public, max-age=${5 * 60}, stale-while-revalidate=${24 * 60 * 60}`,
}
export default TEMPORARY_HEADERS
