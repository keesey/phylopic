import { useRouter } from "next/dist/client/router"
import { isUUID, UUID } from "@phylopic/utils"
import { ParsedUrlQuery } from "querystring"
import { useCallback } from "react"

const useAddLineage = () => {
    const router = useRouter()
    return useCallback(
        async (uuid: UUID) => {
            if (isUUID(uuid)) {
                uuid = uuid.toLowerCase()
                const queryValue = router.query.uuid
                if (queryValue === uuid || (Array.isArray(queryValue) && queryValue.includes(uuid))) {
                    return
                }
                const query: ParsedUrlQuery = JSON.parse(JSON.stringify(router.query))
                if (Array.isArray(query.uuid)) {
                    query.uuid = [...query.uuid, uuid].sort()
                } else if (typeof query.uuid === "string") {
                    query.uuid = [query.uuid, uuid].sort()
                } else {
                    query.uuid = uuid
                }
                router.push({ pathname: router.pathname, query })
            }
        },
        [router],
    )
}
export default useAddLineage
