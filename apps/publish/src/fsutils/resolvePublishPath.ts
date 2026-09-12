import path from "path"
import CURRENT_DIR from "./CURRENT_DIR.js"

const PUBLISH_ROOT = path.resolve(CURRENT_DIR, "../..")

const resolvePublishPath = (filePath: string): string => {
    if (filePath.includes("..")) {
        throw new Error("Invalid publish path.")
    }
    const resolved = path.resolve(PUBLISH_ROOT, filePath)
    if (resolved !== PUBLISH_ROOT && !resolved.startsWith(`${PUBLISH_ROOT}${path.sep}`)) {
        throw new Error("Invalid publish path.")
    }
    return resolved
}

export default resolvePublishPath
