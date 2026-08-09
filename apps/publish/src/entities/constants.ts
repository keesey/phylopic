export const ENTITIES_CACHE_CONTROL = "public, max-age=31536000, immutable"
export const getEntitiesBucket = () => process.env.ENTITIES_BUCKET ?? "entities.phylopic.org"
