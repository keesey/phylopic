const arrayBufferTOString = (buffer: ArrayBufferLike | ArrayLike<number>) =>
    String.fromCharCode.apply(null, Array.from(new Uint16Array(buffer).values()))
const fetchField = async (url: string): Promise<string | null> => {
    try {
        const response = await fetch(url, {
            credentials: "omit",
        })
        console.debug("timetree", response)
        if (!response.ok && response.status >= 400) {
            throw new Error(response.statusText)
        }
        try {
            const json = await response.json()
        } catch (e) {
            console.warn("timetree", String(e))
        }
        console.debug("timetree", Array.from(response.headers.entries()))
        const buffer = await response.arrayBuffer()
        const text = arrayBufferTOString(buffer)
        console.debug("timetree", { text })
        const [, value] = text.split(":", 2)
        return value.trim() || null
    } catch (e) {
        console.warn("timetree", (e as Error).stack)
        throw e
    }
}
export default fetchField
