import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import StandardScreen from "~/pages/screenTypes/StandardScreen"
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
    const suggestionText = useMemo(() => specific?.name.map(({ text }) => text).join(" ") ?? "", [specific])
    const [searchTerm, setSearchTerm] = useState("")
    const handleFormComplete = useCallback((text: string) => {
        setSearchTerm(text)
    }, [])
    const handleResultsCancel = useCallback(() => {
        setSearchTerm("")
    }, [])
    const router = useRouter()
    const handlePatchComplete = useCallback(() => router.push(`/edit/${encodeURIComponent(uuid)}`), [router, uuid])
    const patch = useSubmissionPatcher(uuid, handlePatchComplete)
    const handleComplete = useCallback(
        (identifier: NodeIdentifier) => patch({ general: null, specific: identifier }),
        [patch],
    )
    useEffect(() => {
        if (isSource) {
            // Don't allow taxonomic reassignment for accepted images.
            router.push(`/edit/${encodeURIComponent(uuid)}`)
        }
    }, [isSource, uuid])
    return (
        <StandardScreen>
            {source && <FileView src={source} mode="dark" />}
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
