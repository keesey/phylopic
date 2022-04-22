import { Link } from "phylopic-api-models/src"
import { createSearch } from "phylopic-utils/src"
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
            next: lastPage
                ? null
                : { href: listEndpoint + createSearch({ ...listQuery, page: (pageIndex + 1).toString(10) }) },
            previous:
                pageIndex > 0
                    ? { href: listEndpoint + createSearch({ ...listQuery, page: (pageIndex - 1).toString(10) }) }
                    : null,
            self: { href: listEndpoint + createSearch({ ...listQuery, page: pageIndex.toString(10) }) },
        },
        pageIndex,
    }
}
export default getPageObject
