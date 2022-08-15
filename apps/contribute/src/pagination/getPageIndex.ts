import { NextApiRequest } from "next"
const getPageIndex = (query: NextApiRequest["query"]): number => {
    if (typeof query.page === "string") {
        return parseInt(query.page, 10) ?? 0
    }
    return 0
}
export default getPageIndex
