import { readFile } from "fs/promises"
import path from "path"
import CURRENT_DIR from "./CURRENT_DIR"
const readBuffer = async (filePath: string) => {
    return await readFile(path.join(CURRENT_DIR, "../..", filePath))
}
export default readBuffer
