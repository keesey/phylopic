import { PageWithEmbedded } from "@phylopic/api-models"
import { createSearch, Query } from "@phylopic/utils/dist/http"
import { URL } from "@phylopic/utils/dist/models/types"
const createPageKeyGetter =
    <T = unknown>(endpoint: URL, query?: Query) =>
    (page: number, previousPageData: PageWithEmbedded<T>) => {
        if (previousPageData && !previousPageData._links.next) {
            return null
        }
        return process.env.NEXT_PUBLIC_API_URL + endpoint + createSearch({ ...query, page })
    }
export default createPageKeyGetter
