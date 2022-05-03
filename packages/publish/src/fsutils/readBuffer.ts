import { readFile } from "fs/promises"
import path from "path"
const readBuffer = async (filePath: string) => {
    return await readFile(path.join(__dirname, "../..", filePath))
}
export default readBuffer
