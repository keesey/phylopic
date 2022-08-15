import { Loader } from "@phylopic/ui"
import { Nomen, UUID } from "@phylopic/utils"
import axios from "axios"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import useSWRImmutable from "swr/immutable"
import useAuthToken from "~/auth/hooks/useAuthToken"
import isServerError from "~/http/isServerError"
import { NodePost } from "~/models/types/NodePost"
import NameView from "~/ui/NameView"
import Form from "../../Form"
import ParentSearchEntryResult from "./ParentSearchEntryResult"
export type Props = {
    name: Nomen
    onComplete?: (result: UUID) => void
}
type PostKey = { data: NodePost; url: string }
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
const ParentUUIDResult: FC<Props> = ({ name, onComplete }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [parentUUID, setParentUUID] = useState<UUID | null>(null)
    const postKey = useMemo<PostKey | null>(() => {
        if (parentUUID) {
            return { data: { name, parent: parentUUID }, url: "/api/nodes" }
        }
        return null
    }, [name, parentUUID])
    const poster = useAuthorizedPoster()
    const postSWR = useSWRImmutable(postKey, poster, {
        errorRetryCount: 4,
        shouldRetryOnError: isServerError,
    })
    useEffect(() => {
        if (postSWR.data?.uuid) {
            onComplete?.(postSWR.data.uuid)
        }
    }, [onComplete, postSWR.data?.uuid])
    if (postSWR.error) {
        return (
            <>
                <p>Ack! Couldn&rsquo;t add that. Some sort of error:</p>
                <p>&ldquo;{String(postSWR.error)}&rdquo;</p>
                <p>I don&rsquo;t know what that means. Try again later, I guess?</p>
            </>
        )
    }
    if (postSWR.isValidating) {
        return (
            <>
                <p>Adding that&hellip;</p>
                <Loader />
            </>
        )
    }
    return (
        <>
            <p>
                Okay, if you&rsquo;re sure, can you give me a more general group that &ldquo;
                <NameView value={name} />
                &rdquo; belongs to?
            </p>
            <Form onComplete={setSearchTerm} placeholder="Larger taxonomic group" />
            <br />
            <ParentSearchEntryResult onComplete={setParentUUID} searchTerm={searchTerm} />
        </>
    )
}
export default ParentUUIDResult
