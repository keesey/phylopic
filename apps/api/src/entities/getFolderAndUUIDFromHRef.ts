import { EntityFolder } from "@phylopic/s3-entities"
import { extractPath, isUUID, UUID } from "@phylopic/utils"

const isEntityFolder = (path: string): path is EntityFolder =>
    path === "contributors" || path === "images" || path === "nodes"

const getFolderAndUUIDFromHRef = (href: string) => {
    const parts = extractPath(href).split(/\//g).filter(Boolean)
    if (parts.length !== 2) {
        return null
    }
    const [path, uuid] = parts
    if (!isEntityFolder(path) || !isUUID(uuid)) {
        return null
    }
    return [path, uuid] as Readonly<[EntityFolder, UUID]>
}

export default getFolderAndUUIDFromHRef
