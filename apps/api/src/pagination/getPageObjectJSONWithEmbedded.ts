import { PageWithEmbedded, TitledLink } from "@phylopic/api-models"
import { stringifyNormalized } from "@phylopic/utils"
import getPageObject from "./getPageObject"
const getPageObjectJSONWithEmbedded = (
    listEndpoint: string,
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>,
    pageIndex: number,
    lastPage: boolean,
    itemLinks: readonly TitledLink[],
    itemsJSON: readonly string[],
) => {
    const o: PageWithEmbedded<unknown> = {
        _embedded: {},
        ...getPageObject(listEndpoint, listQuery, pageIndex, lastPage, itemLinks),
    }
    const json = stringifyNormalized(o)
    return json.replace('"_embedded":{}', `"_embedded":{"items":[${itemsJSON.join(",")}]}`)
}
export default getPageObjectJSONWithEmbedded
