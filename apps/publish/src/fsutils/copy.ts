import { copyFile } from "fs/promises"
import path from "path"
import CURRENT_DIR from "./CURRENT_DIR"
import ensureDir from "./ensureDir"
const copy = async (source: string, dest: string) => {
    await ensureDir(dest)
    return await copyFile(path.join(CURRENT_DIR, "../..", source), path.join(CURRENT_DIR, "../..", dest))
}
export default copy
