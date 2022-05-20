import { List } from "@phylopic/api-models"
import { createSearch } from "@phylopic/utils"
import BUILD from "../build/BUILD"
const getListObject = (
    endpoint: string,
    query: Readonly<Record<string, string | number | boolean | undefined>>,
    totalItems: number,
    itemsPerPage: number,
): List => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    return {
        _links: {
            firstPage: totalPages > 0 ? { href: endpoint + createSearch({ ...query, page: 0 }) } : null,
            lastPage:
                totalPages > 0
                    ? {
                          href: endpoint + createSearch({ ...query, page: totalPages - 1 }),
                      }
                    : null,
            self: { href: endpoint + createSearch(query) },
        },
        build: BUILD,
        itemsPerPage,
        totalItems,
        totalPages,
    }
}
export default getListObject
