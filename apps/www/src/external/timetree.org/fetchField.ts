const arrayBufferToString = (buffer: ArrayBufferLike | ArrayLike<number>) => String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer).values()));
const fetchField = async (url: string): Promise<string | null> => {
    try {
        const response = await fetch(url)
        if (!response.ok && response.status >= 400) {
            throw new Error(response.statusText)
        }
        const buffer = await response.arrayBuffer()
        const text = arrayBufferToString(buffer)
        const [, value] = text.split(":", 2)
        return value.trim() || null
    } catch (e) {
        console.warn(e)
        throw e
    }
}
export default fetchField
