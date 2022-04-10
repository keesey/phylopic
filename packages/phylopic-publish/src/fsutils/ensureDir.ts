import { existsSync } from "fs"
import { mkdir } from "fs/promises"
import path from "path"
const ensureDir = async (filePath: string) => {
    filePath = path.join(__dirname, "../../", filePath)
    const dir = filePath.split(/\//g).slice(0, -1).join("/")
    if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true })
    }
}
export default ensureDir
