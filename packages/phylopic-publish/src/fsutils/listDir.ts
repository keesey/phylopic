import { readdir } from "fs/promises"
import path from "path"
const listDir = async (filePath: string) => {
    return (await readdir(path.join(__dirname, "../..", filePath))).filter(path => !path.startsWith("."))
}
export default listDir
