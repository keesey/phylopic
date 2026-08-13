import { Data } from "@phylopic/api-models"
import axios from "axios"

const getBuild = async (): Promise<number> => {
    const index = await axios.get<Data>(process.env.NEXT_PUBLIC_API_URL ?? "")
    const build = index.data.build
    if (!build) {
        throw new Error("Could not determine build index.")
    }
    return build
}

export default getBuild
