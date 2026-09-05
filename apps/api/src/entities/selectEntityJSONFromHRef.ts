import { S3Client } from "@aws-sdk/client-s3"
import { getEntityJSONKey } from "@phylopic/s3-entities"
import BUILD from "../build/BUILD"
import getEntityFolderAndUUIDFromHRef from "./getEntityFolderAndUUIDFromHRef"
import selectJSONFromS3Entities from "./selectJSONFromS3Entities"

const selectEntityJSONFromHRef = async (client: S3Client, href: string): Promise<string> => {
    const folderAndUUID = getEntityFolderAndUUIDFromHRef(href)
    if (!folderAndUUID) {
        return "null"
    }
    const [folder, uuid] = folderAndUUID
    return (await selectJSONFromS3Entities(client, getEntityJSONKey(BUILD, folder, uuid))) ?? "null"
}

export default selectEntityJSONFromHRef
