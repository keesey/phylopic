import { UUID } from "@phylopic/utils"
export type EntityFolder = "contributors" | "images" | "nodes"
export const getEntityJSONKey = (build: number, folder: EntityFolder, uuid: UUID) =>
    [build, folder, uuid].map(value => encodeURIComponent(value)).join("/") + ".json"
export const getBuildPrefix = (build: number) => encodeURIComponent(build) + "/"
