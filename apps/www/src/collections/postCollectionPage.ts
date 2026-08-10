import { isUUIDish } from "@phylopic/utils"
import axios from "axios"

const postCollectionPage = async (uuids: readonly string[]): Promise<string> => {
    const response = await axios.post<{ uuid: string }>("/api/collections", uuids)
    const { uuid } = response.data ?? {}
    if (!isUUIDish(uuid)) {
        throw new Error("Collection page was created but no collection ID was returned.")
    }
    return uuid
}

export default postCollectionPage
