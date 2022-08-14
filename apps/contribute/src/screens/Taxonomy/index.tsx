import { UUID } from "@phylopic/utils"
import { FC, useCallback, useMemo, useState } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageMutator from "~/editing/hooks/useImageMutator"
import useImageNode from "~/editing/hooks/useImageNode"
import useImageSrc from "~/editing/hooks/useImageSrc"
import ImageContext from "~/editing/ImageContext"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import FileView from "~/ui/FileView"
import Form from "./Form"
import IdentifierResults from "./IdentifierResults"
export type Props = {
    uuid: UUID
}
const Taxonomy: FC<Props> = ({ uuid }) => {
    const image = useImage(uuid)
    const src = useImageSrc(uuid)
    const specific = useImageNode(uuid, "specific")
    const suggestionText = useMemo(() => specific?.names[0].map(({ text }) => text).join(" ") ?? "", [specific])
    const [searchTerm, setSearchTerm] = useState("")
    const handleFormComplete = useCallback((text: string) => {
        setSearchTerm(text)
    }, [])
    const handleResultsCancel = useCallback(() => {
        setSearchTerm("")
    }, [])
    const mutate = useImageMutator(uuid)
    const handleComplete = useCallback((uuid: UUID) => mutate({ general: null, specific: uuid }), [mutate])
    if (!image) {
        return null
    }
    return (
        <DialogueScreen>
            <ImageContext.Provider value={uuid}>
                <FileView src={src} mode="dark" />
                {!image.submitted && Boolean(src) && (
                    <>
                        <p>
                            <strong>Looks great!</strong> What is it?
                        </p>
                        <p>(Please be as specific as possible.)</p>
                    </>
                )}
                {(image.submitted || !src) && (
                    <>
                        <p>So what is it?</p>
                        <p>(Please be as specific as possible.)</p>
                    </>
                )}
                <Form onComplete={handleFormComplete} suggestion={suggestionText} />
                <br />
                <IdentifierResults searchTerm={searchTerm} onCancel={handleResultsCancel} onComplete={handleComplete} />
            </ImageContext.Provider>
        </DialogueScreen>
    )
}
export default Taxonomy
