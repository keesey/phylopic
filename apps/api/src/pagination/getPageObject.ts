import { Link, Page } from "@phylopic/api-models"
import { createSearch } from "@phylopic/utils"
import BUILD from "../build/BUILD"
const getPageObject = (
    listEndpoint: string,
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>,
    index: number,
    lastPage: boolean,
    items: readonly Link[],
): Page => {
    return {
        _links: {
            items,
            list: { href: listEndpoint + createSearch(listQuery) },
            next: lastPage ? null : { href: listEndpoint + createSearch({ ...listQuery, page: index + 1 }) },
            previous: index > 0 ? { href: listEndpoint + createSearch({ ...listQuery, page: index - 1 }) } : null,
            self: { href: listEndpoint + createSearch({ ...listQuery, page: index }) },
        },
        build: BUILD,
        index,
    }
}
export default getPageObject
