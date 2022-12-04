import axios from "axios"
import { useRouter } from "next/router"
import { useCallback } from "react"
import { KeyedMutator, SWRResponse } from "swr"
import { UrlObject } from "url"
const useDeletor = (
    key: string,
    response: SWRResponse,
    associatedMutators: readonly KeyedMutator<any>[] = [],
    route: UrlObject | string = "/",
) => {
    const router = useRouter()
    const { mutate } = response
    return useCallback(() => {
        if (confirm("Are you sure you want to delete this image?")) {
            const promise = axios.delete(key)
            mutate(
                promise.then(() => {}),
                { optimisticData: undefined, revalidate: true, rollbackOnError: true },
            )
            for (const mutator of associatedMutators) {
                mutator(undefined, { revalidate: true })
            }
            promise.then(() => router.push(route))
        }
    }, [associatedMutators, key, mutate, route, router])
}
export default useDeletor
