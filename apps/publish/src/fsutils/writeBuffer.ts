import { writeFile } from "fs/promises"
import path from "path"
import CURRENT_DIR from "./CURRENT_DIR.js"
import ensureDir from "./ensureDir.js"
const writeBuffer = async (filePath: string, buffer: Buffer) => {
    await ensureDir(filePath)
    return await writeFile(path.join(CURRENT_DIR, "../..", filePath), buffer)
}
export default writeBuffer
