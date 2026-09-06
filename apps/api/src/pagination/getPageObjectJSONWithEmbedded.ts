import { TitledLink } from "@phylopic/api-models"
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
    const items = itemsJSON.map(json => JSON.parse(json) as unknown)
    return stringifyNormalized({
        ...getPageObject(listEndpoint, listQuery, pageIndex, lastPage, itemLinks),
        _embedded: { items },
    })
}

export default getPageObjectJSONWithEmbedded
