import { Node } from "@phylopic/source-models"
import { Loader } from "@phylopic/ui"
import { Nomen, UUID } from "@phylopic/utils"
import { FC, useEffect, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { NodePost } from "~/models/types/NodePost"
import Speech from "~/ui/Speech"
export type Props = {
    name: Nomen
    onComplete: (uuid: UUID) => void
    parentUUID: UUID
}
const NewNodeCreator: FC<Props> = ({ name, onComplete, parentUUID }) => {
    const post: NodePost = useMemo(
        () => ({
            name,
            parent: parentUUID,
        }),
        [name, parentUUID],
    )
    const key = useMemo(
        () => ({
            data: post,
            method: "POST",
            url: "/api/nodes",
        }),
        [post],
    )
    const fetcher = useAuthorizedJSONFetcher<Node & { uuid: UUID }>()
    const { data, error, isValidating } = useSWRImmutable(key, fetcher)
    useEffect(() => {
        if (data) {
            onComplete(data.uuid)
        }
    }, [data, onComplete])
    return (
        <>
            <Speech mode="system">
                <p>Nice! That will be our first one.</p>
            </Speech>
            {isValidating && (
                <Speech mode="system">
                    <p>Adding that&hellip;</p>
                    <Loader />
                </Speech>
            )}
            {!isValidating && error && (
                <Speech mode="system">
                    <p>Whoops! Couldn&rsquo;t add that.</p>
                    <p>&ldquo;{String(error)}&rdquo;</p>
                </Speech>
            )}
        </>
    )
}
export default NewNodeCreator
