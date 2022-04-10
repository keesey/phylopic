import { RmOptions } from "fs"
import { rm } from "fs/promises"
import path from "path"
const remove = async (filePath: string, options?: RmOptions) => {
    return await rm(path.join(__dirname, "../..", filePath), options)
}
export default remove
