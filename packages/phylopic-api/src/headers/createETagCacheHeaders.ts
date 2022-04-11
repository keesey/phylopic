const createETagCacheHeaders = (eTag: string) => ({
    "cache-control": "public,max-age=3600,stale-while-revalidate=1209600",
    etag: `${JSON.stringify(eTag)}`,
})
export default createETagCacheHeaders
