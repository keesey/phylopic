import { Loader } from "@phylopic/ui"
import { Authority, Namespace, ObjectID, UUID } from "@phylopic/utils"
import axios from "axios"
import { FC, useCallback, useEffect, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useAuthToken from "~/auth/hooks/useAuthToken"
import isServerError from "~/http/isServerError"
import { ExternalPost } from "~/models/types/ExternalPost"
export type Props = {
    authority: Authority
    namespace: Namespace
    objectID: ObjectID
    onComplete?: (uuid: UUID) => void
}
type PostKey = { data: ExternalPost; url: string }
const useAuthorizedPoster = () => {
    const token = useAuthToken()
    return useCallback(
        async (key: PostKey) => {
            if (!token) {
                throw new Error("Unauthorized.")
            }
            const result = await axios.post<Node & { uuid: UUID }>(key.url, key.data, {
                headers: { authorization: `Bearer ${token}` },
                responseType: "json",
            })
            return result.data
        },
        [token],
    )
}
const ExternalResult: FC<Props> = ({ authority, namespace, objectID, onComplete }) => {
    const key = useMemo<PostKey>(
        () => ({
            data: {
                authority,
                namespace,
                objectID,
            },
            url: "/api/externals",
        }),
        [authority, namespace, objectID],
    )
    const poster = useAuthorizedPoster()
    const { data, error } = useSWRImmutable(key, poster, {
        errorRetryCount: 4,
        shouldRetryOnError: isServerError,
    })
    useEffect(() => {
        if (data) {
            onComplete?.(data.uuid)
        }
    }, [data, onComplete])
    if (data) {
        return <p>Added it!</p>
    }
    if (error) {
        return (
            <>
                <p>Ack! Couldn&rsquo;t find that. Some sort of error:</p>
                <p>&ldquo;{String(error)}&rdquo;</p>
                <p>I don&rsquo;t know what that means. Try again later, I guess?</p>
            </>
        )
    }
    return (
        <>
            <p>Looking that up&hellip;</p>
            <Loader />
        </>
    )
}
export default ExternalResult
