import { RmOptions } from "fs"
import { rm } from "fs/promises"
import path from "path"
import CURRENT_DIR from "./CURRENT_DIR"
const remove = async (filePath: string, options?: RmOptions) => {
    return await rm(path.join(CURRENT_DIR, "../..", filePath), options)
}
export default remove
