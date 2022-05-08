import { URL } from "../models/types/URL.js"
export const extractPath = (url: URL) => {
    const [path] = url.split(/[?#]/, 2)
    return path
}
export default extractPath
