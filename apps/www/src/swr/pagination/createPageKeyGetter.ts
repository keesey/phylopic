import { PageWithEmbedded } from "@phylopic/api-models"
import { createSearch, Query, URL } from "@phylopic/utils"
const createPageKeyGetter =
    <T = unknown>(endpoint: URL, query?: Query) =>
    (page: number, previousPageData: PageWithEmbedded<T>) => {
        if (previousPageData && !previousPageData._links.next) {
            return null
        }
        return endpoint + createSearch({ ...query, page })
    }
export default createPageKeyGetter
