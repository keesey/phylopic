import { Link } from "phylopic-api-types"
import getPageObject from "./getPageObject"
const getPageObjectWithEmbedded = <T>(
    listEndpoint: string,
    listQuery: Readonly<Record<string, string>>,
    pageIndex: number,
    lastPage: boolean,
    itemLinks: readonly Link[],
    items: readonly T[],
) => {
    return {
        _embedded: { items },
        ...getPageObject(listEndpoint, listQuery, pageIndex, lastPage, itemLinks),
    }
}
export default getPageObjectWithEmbedded
