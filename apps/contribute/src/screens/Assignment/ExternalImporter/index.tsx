import { Node } from "@phylopic/source-models"
import { Loader } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC, useEffect, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { SearchEntry } from "~/search/SearchEntry"
import Speech from "~/ui/Speech"
export type Props = {
    external: Pick<SearchEntry, "authority" | "namespace" | "objectID">
    onComplete: (uuid: UUID) => void
}
const ExternalImporter: FC<Props> = ({ external, onComplete }) => {
    const key = useMemo(
        () => ({
            data: external,
            method: "POST",
            url: "/api/externals",
        }),
        [external],
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
                <p>
                    <strong>Nice!</strong> That will be our first one.
                </p>
            </Speech>
            {isValidating && (
                <Speech mode="system">
                    <p>Looking that up&hellip;</p>
                    <Loader />
                </Speech>
            )}
            {!isValidating && error && (
                <Speech mode="system">
                    <p>
                        <strong>Whoops!</strong> Couldn&rsquo;t find that right now.
                    </p>
                    <p>&ldquo;{String(error)}&rdquo;</p>
                </Speech>
            )}
        </>
    )
}
export default ExternalImporter
