import { readdir } from "fs/promises"
import path from "path"
import resolvePublishPath from "./resolvePublishPath.js"
const listDir = async (filePath: string) => {
    return (await readdir(resolvePublishPath(filePath))).filter(entry => !entry.startsWith("."))
}
export default listDir
