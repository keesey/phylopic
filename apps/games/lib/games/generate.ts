import { generate as generateFourClades } from "~/games/four-clades/generate"
import { getBuild } from "../api"

export const generate = async (code: string) => {
    switch (code) {
        case "four-clades": {
            return generateFourClades(await getBuild(), 8, 4, 4)
        }
        default: {
            throw new Error("Invalid game.")
        }
    }
}
