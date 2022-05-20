import { isImageMediaType } from "@phylopic/utils"
const upload = async (path: string, file: File) => {
    if (!isImageMediaType(file.type)) {
        throw new Error("File is not of an accepted type.")
    }
    const headers = new Headers({
        "Content-Type": file.type,
    })
    const response = await fetch(path, {
        body: await file.arrayBuffer(),
        headers,
        method: "PUT",
    })
    if (!response.ok) {
        throw new Error(response.statusText)
    }
}
export default upload
