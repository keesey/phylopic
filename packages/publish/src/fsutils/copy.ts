import { copyFile } from "fs/promises"
import path from "path"
import ensureDir from "./ensureDir"
const copy = async (source: string, dest: string) => {
    await ensureDir(dest)
    return await copyFile(path.join(__dirname, "../..", source), path.join(__dirname, "../..", dest))
}
export default copy
