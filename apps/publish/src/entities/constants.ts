export const ENTITIES_CACHE_CONTROL = "public, max-age=31536000, immutable"
export const ENTITIES_STAGING_ROOT = ".s3/entities.phylopic.org"
/** In-flight local staging writes. Raise `UV_THREADPOOL_SIZE` (e.g. 32) on fast SSDs. */
export const WRITE_CONCURRENCY = 512
export const WRITE_QUEUE_HIGH_WATER = 512
