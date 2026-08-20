export type StaticJSONName = "namespaces"

export const getStaticJSONKey = (build: number, name: StaticJSONName) =>
    [build, name].map(value => encodeURIComponent(value)).join("/") + ".json"
