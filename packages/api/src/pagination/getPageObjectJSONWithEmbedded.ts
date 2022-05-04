import { Link } from "@phylopic/api-models"
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
        _embedded: {},
        ...getPageObject(listEndpoint, listQuery, pageIndex, lastPage, itemLinks),
    }
    const json = JSON.stringify(o)
    return json.replace('"_embedded":{}', `"_embedded":{"items":[${itemsJSON.join(",")}]}`)
}
export default getPageObjectJSONWithEmbedded
