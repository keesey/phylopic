import { S3Client } from "@aws-sdk/client-s3"
import { getEntityJSONKey } from "@phylopic/s3-entities"
import BUILD from "../build/BUILD"
import getFolderAndUUIDFromHRef from "./getFolderAndUUIDFromHRef"
import getS3EntityJSON from "./getS3EntityJSON"

const getEntityJSONFromHRef = async (client: S3Client, href: string): Promise<string> => {
    const folderAndUUID = getFolderAndUUIDFromHRef(href)
    if (!folderAndUUID) {
        return "null"
    }
    const [folder, uuid] = folderAndUUID
    return (await getS3EntityJSON(client, getEntityJSONKey(BUILD, folder, uuid))) ?? "null"
}

export default getEntityJSONFromHRef
