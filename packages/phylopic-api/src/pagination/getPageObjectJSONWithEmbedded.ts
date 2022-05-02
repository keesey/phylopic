import { Link } from "phylopic-api-models/dist/types/Link"
import getPageObject from "./getPageObject"
const getPageObjectJSONWithEmbedded = (
    listEndpoint: string,
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>,
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
