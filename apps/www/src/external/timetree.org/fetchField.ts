import axios from "axios"

const arrayBufferToString = (buffer: ArrayBufferLike | ArrayLike<number>) =>
    String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer).values()))
const fetchField = async (url: string): Promise<string | null> => {
    try {
        const response = await axios.get<ArrayBuffer>(url, { responseType: "arraybuffer" })
        const text = arrayBufferToString(response.data)
        const [, value] = text.split(":", 2)
        return value.trim() || null
    } catch (e) {
        console.warn(e)
        throw e
    }
}
export default fetchField
