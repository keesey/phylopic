import { Link } from "@phylopic/api-models"
import { isUUIDish } from "@phylopic/utils"
import axios from "axios"

const postCollectionPage = async (uuids: readonly string[]): Promise<string | undefined> => {
    const response = await axios.post<Link>(`${process.env.NEXT_PUBLIC_API_URL}/collections`, uuids, {
        maxRedirects: 0,
        validateStatus: status => status === 303,
    })
    const segment = response.data?.href?.split("/").pop()
    return segment && isUUIDish(segment) ? segment : undefined
}

export default postCollectionPage
