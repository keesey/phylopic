import fetch from "cross-fetch"
import { decode } from "jsonwebtoken"
import { JWT } from "~/auth/JWT"
const fetchJWT = async (key: string): Promise<JWT> => {
    const response = await fetch(key)
    if (response.ok) {
        const jwt = await response.text()
        if (!decode(jwt)) {
            throw new Error("Invalid token.")
        }
        return jwt
    }
    throw new Error(response.statusText)
}
export default fetchJWT
