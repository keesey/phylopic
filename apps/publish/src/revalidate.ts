import axios from "axios"
import "dotenv/config"
;(async () => {
    const STATIC_PATHS = ["/", "/contributors", "/images", "/nodes"]
    const revalidatePath = async (path: string) => {
        try {
            const response = await axios.get<{ revalidated: boolean }>(
                `${process.env.WWW_URL}/api/revalidate?path=${encodeURIComponent(path)}&secret=${encodeURIComponent(process.env.REVALIDATE_TOKEN ?? "")}`,
            )
            if (!response.data.revalidated) {
                console.warn(`Failed to revalidate path: ${path}`)
            }
        } catch (e) {
            console.error(`Error revalidating path: ${path}\n${String(e)}`)
        }
    }
    try {
        await Promise.all(STATIC_PATHS.map(path => revalidatePath(path)))
        console.info("Revalidated website.")
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
    process.exit(0)
})()
