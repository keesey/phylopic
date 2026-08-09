export type EntityJSONSource = "postgres" | "s3" | "s3-fallback"
const parseEntityJSONSource = (): EntityJSONSource => {
    const value = process.env.ENTITY_JSON_SOURCE
    if (value === "postgres" || value === "s3" || value === "s3-fallback") {
        return value
    }
    return "s3-fallback"
}
const ENTITY_JSON_SOURCE = parseEntityJSONSource()
export default ENTITY_JSON_SOURCE
