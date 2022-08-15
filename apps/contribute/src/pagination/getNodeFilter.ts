import { normalizeText } from "@phylopic/utils"
import { NextApiRequest } from "next"
const getNodeFilter = (query: NextApiRequest["query"]): string | null => {
    const filter = typeof query.filter === "string" ? normalizeText(query.filter) : null
    return filter || null
}
export default getNodeFilter
