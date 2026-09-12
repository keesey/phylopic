export type StaticJSONName = "namespaces"

export const getStaticJSONKey = (build: number, name: StaticJSONName) => `${build}/${name}.json`
