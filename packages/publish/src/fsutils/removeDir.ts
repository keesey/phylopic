import { RmDirOptions } from "fs"
import { rmdir } from "fs/promises"
import path from "path"
const removeDir = async (filePath: string, options?: RmDirOptions) => {
    return await rmdir(path.join(__dirname, "../..", filePath), options)
}
export default removeDir
