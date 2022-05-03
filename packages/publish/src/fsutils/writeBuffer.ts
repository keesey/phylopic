import { writeFile } from "fs/promises"
import path from "path"
import ensureDir from "./ensureDir"
const writeBuffer = async (filePath: string, buffer: Buffer) => {
    await ensureDir(filePath)
    return await writeFile(path.join(__dirname, "../..", filePath), buffer)
}
export default writeBuffer
