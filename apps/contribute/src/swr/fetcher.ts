import fetch from "cross-fetch"
const fetcher = async <T>(key: string) => {
    const response = await fetch(key)
    if (response.ok) {
        const data: T = await response.json()
        return data as T
    }
    throw new Error(response.statusText)
}
export default fetcher
