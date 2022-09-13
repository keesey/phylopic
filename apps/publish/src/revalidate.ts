import axios from "axios";
import "dotenv/config";
(async () => {
    try {
        console.info("Revalidating website...")
        const response = await axios.get<{ revalidated: boolean }>(`https://${process.env.WWW_DOMAIN}/api/revalidate?secret=${encodeURIComponent(process.env.REVALIDATE_KEY ?? "")}`)
        if (!response.data.revalidated) {
            throw new Error("Failed to revalidate.")
        }
        console.info("Revalidated website.")
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
    process.exit(0)
})()
