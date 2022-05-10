import { RmDirOptions } from "fs"
import { rmdir } from "fs/promises"
import path from "path"
import CURRENT_DIR from "./CURRENT_DIR.js"
const removeDir = async (filePath: string, options?: RmDirOptions) => {
    return await rmdir(path.join(CURRENT_DIR, "../..", filePath), options)
}
export default removeDir
