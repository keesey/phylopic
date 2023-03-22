import { Page, TitledLink } from "@phylopic/api-models"
import { createSearch } from "@phylopic/utils"
import omit from "lodash/omit"
import BUILD from "../build/BUILD"
const getPageObject = (
    listEndpoint: string,
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>,
    index: number,
    lastPage: boolean,
    items: readonly TitledLink[],
): Page => {
    return {
        _links: {
            items,
            list: { href: listEndpoint + createSearch(omit(listQuery, "page")) },
            next: lastPage ? null : { href: listEndpoint + createSearch({ ...listQuery, page: index + 1 }) },
            previous: index > 0 ? { href: listEndpoint + createSearch({ ...listQuery, page: index - 1 }) } : null,
            self: { href: listEndpoint + createSearch({ ...listQuery, page: index }) },
        },
        build: BUILD,
        index,
    }
}
export default getPageObject
