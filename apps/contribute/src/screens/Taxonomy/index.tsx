import { NodeIdentifier } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import axios from "axios"
import { useRouter } from "next/router"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useFileSource from "~/editing/useFileSource"
import useSpecific from "~/editing/useSpecific"
import StandardScreen from "~/pages/screenTypes/StandardScreen"
import useSubmissionSWR from "~/s3/swr/useSubmissionSWR"
import FileView from "~/ui/FileView"
import Form from "./Form"
import IdentifierResults from "./IdentifierResults"
export type Props = {
    uuid: UUID
}
const Taxonomy: FC<Props> = ({ uuid }) => {
    const token = useAuthToken()
    const { data: specific } = useSpecific(uuid)
    const { data: source, isSource } = useFileSource(uuid)
    const { data: submission, mutate } = useSubmissionSWR(uuid)
    const suggestionText = useMemo(() => specific?.name.map(({ text }) => text).join(" ") ?? "", [specific])
    const [searchTerm, setSearchTerm] = useState("")
    const handleFormComplete = useCallback((text: string) => {
        setSearchTerm(text)
    }, [])
    const handleResultsCancel = useCallback(() => {
        setSearchTerm("")
    }, [])
    const router = useRouter()
    const handleComplete = useCallback(
        (identifier: NodeIdentifier) => {
            mutate(
                async () => {
                    const patch = { general: null, specific: identifier }
                    const result = { ...submission, ...patch }
                    await axios.patch(`/api/submissions/${encodeURIComponent(uuid)}`, patch, {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    })
                    router.push(`/edit/${encodeURIComponent(uuid)}`) // Don't await
                    return result
                },
                { revalidate: true },
            )
        },
        [mutate, router],
    )
    useEffect(() => {
        if (isSource) {
            // Don't allow taxonomic reassignment for accepted images.
            router.push(`/edit/${encodeURIComponent(uuid)}`)
        }
    }, [isSource, uuid])
    return (
        <StandardScreen>
            {source && <FileView src={source} />}
            {!specific && (
                <>
                    <p>
                        <strong>Looks great!</strong> What is it?
                    </p>
                    <p>(Please be as specific as possible.)</p>
                </>
            )}
            {specific && (
                <>
                    <p>So what is it?</p>
                    <p>(Please be as specific as possible.)</p>
                </>
            )}
            <Form onComplete={handleFormComplete} suggestion={suggestionText} />
            <br />
            <IdentifierResults searchTerm={searchTerm} onCancel={handleResultsCancel} onComplete={handleComplete} />
        </StandardScreen>
    )
}
export default Taxonomy
