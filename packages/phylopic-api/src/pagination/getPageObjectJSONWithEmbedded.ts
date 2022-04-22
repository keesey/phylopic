import { Link } from "phylopic-api-models/src/types"
import getPageObject from "./getPageObject"
const getPageObjectJSONWithEmbedded = (
    listEndpoint: string,
    listQuery: Readonly<Record<string, string>>,
    pageIndex: number,
    lastPage: boolean,
    itemLinks: readonly Link[],
    itemsJSON: readonly string[],
) => {
    const o = {
        ...getPageObject(listEndpoint, listQuery, pageIndex, lastPage, itemLinks),
        _embedded: {},
    }
    const json = JSON.stringify(o)
    return json.replace('"_embedded":{}', `"_embedded":{"items":[${itemsJSON.join(",")}]}`)
}
export default getPageObjectJSONWithEmbedded
