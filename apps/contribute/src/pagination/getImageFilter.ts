import { NextApiRequest } from "next"
import { ImageFilter } from "./ImageFilter"
const getImageFilter = (query: NextApiRequest["query"]): ImageFilter => {
    const filter = query.filter
    if (filter === "accepted" || filter === "incomplete" || filter === "withdrawn") {
        return filter
    }
    return "submitted"
}
export default getImageFilter
