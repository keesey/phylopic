import createSearch from "../utils/http/createSearch"
const getListObject = (
    endpoint: string,
    query: Readonly<Record<string, string>>,
    totalItems: number,
    itemsPerPage: number,
) => {
    const totalPages = Math.floor(totalItems / itemsPerPage)
    return {
        _links: {
            firstPage: totalItems > 0 ? { href: endpoint + createSearch({ ...query, page: "0" }) } : null,
            lastPage:
                totalItems > 0
                    ? {
                          href: endpoint + createSearch({ ...query, page: (totalPages - 1).toString(10) }),
                      }
                    : null,
            self: { href: endpoint + createSearch(query) },
        },
        itemsPerPage,
        totalItems,
        totalPages,
    }
}
export default getListObject
