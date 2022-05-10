import { readdir } from "fs/promises"
import path from "path"
import CURRENT_DIR from "./CURRENT_DIR.js"
const listDir = async (filePath: string) => {
    return (await readdir(path.join(CURRENT_DIR, "../..", filePath))).filter(path => !path.startsWith("."))
}
export default listDir
