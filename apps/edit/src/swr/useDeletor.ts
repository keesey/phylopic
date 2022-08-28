import axios from "axios"
import { useRouter } from "next/router"
import { useCallback } from "react"
import { KeyedMutator, SWRResponse } from "swr"
import { UrlObject } from "url"
const useDeletor = (
    key: string,
    response: SWRResponse,
    associatedMutators: readonly KeyedMutator<unknown>[] = [],
    route: UrlObject | string = "/",
) => {
    const router = useRouter()
    return useCallback(() => {
        const promise = axios.delete(key)
        response.mutate(
            promise.then(() => {}),
            { optimisticData: undefined, revalidate: true, rollbackOnError: true },
        )
        for (const mutate of associatedMutators) {
            mutate(undefined, { revalidate: true })
        }
        promise.then(() => router.push(route))
    }, [associatedMutators, key, response.data, response.mutate, route])
}
export default useDeletor
