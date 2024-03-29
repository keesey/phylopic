import { JWT } from "@phylopic/source-models"
import axios from "axios"
import { decode } from "jsonwebtoken"
const fetchJWT = async (key: string): Promise<JWT> => {
    const response = await axios.get<JWT>(key, {
        responseType: "text",
    })
    if (typeof response.data !== "string") {
        throw new Error("Invalid response for key: " + key)
    }
    if (!decode(response.data)) {
        throw new Error("Downloaded an invalid token.")
    }
    return response.data
}
export default fetchJWT
