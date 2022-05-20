import { existsSync } from "fs"
import { mkdir } from "fs/promises"
import path from "path"
import CURRENT_DIR from "./CURRENT_DIR.js"
const ensureDir = async (filePath: string) => {
    filePath = path.join(CURRENT_DIR, "../../", filePath)
    const dir = filePath.split(/\//g).slice(0, -1).join("/")
    if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true })
    }
}
export default ensureDir
