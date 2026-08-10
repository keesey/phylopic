import axios from "axios"
import "dotenv/config"
;(async () => {
    const token = process.env.REVALIDATE_TOKEN
    const wwwUrl = process.env.WWW_URL
    if (!token) {
        console.error("REVALIDATE_TOKEN is required for revalidation.")
        process.exit(1)
    }
    if (!wwwUrl) {
        console.error("WWW_URL is required for revalidation.")
        process.exit(1)
    }
    try {
        console.info("Revalidating website...")
        const response = await axios.post<{ paths: readonly string[]; revalidated: boolean }>(
            `${wwwUrl}/api/revalidate`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )
        if (!response.data.revalidated) {
            throw new Error("Failed to revalidate.")
        }
        console.info("Revalidated website:", response.data.paths.join(", "))
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
    process.exit(0)
})()
