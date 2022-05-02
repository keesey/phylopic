import { Link } from "phylopic-api-models/dist/types/Link"
import createSearch from "phylopic-utils/dist/http/createSearch"
const getPageObject = (
    listEndpoint: string,
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>,
    pageIndex: number,
    lastPage: boolean,
    items: readonly Link[],
) => {
    return {
        _links: {
            items,
            list: { href: listEndpoint + createSearch(listQuery) },
            next: lastPage ? null : { href: listEndpoint + createSearch({ ...listQuery, page: pageIndex + 1 }) },
            previous:
                pageIndex > 0 ? { href: listEndpoint + createSearch({ ...listQuery, page: pageIndex - 1 }) } : null,
            self: { href: listEndpoint + createSearch({ ...listQuery, page: pageIndex }) },
        },
        pageIndex,
    }
}
export default getPageObject
