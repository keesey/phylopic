import { AnchorLink } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC, useCallback, useMemo, useState } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageMutator from "~/editing/hooks/useImageMutator"
import useImageNode from "~/editing/hooks/useImageNode"
import useImageSrc from "~/editing/hooks/useImageSrc"
import ImageContext from "~/editing/ImageContext"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import FileView from "~/ui/FileView"
import NameView from "~/ui/NameView"
import Form from "./Form"
import TaxonUUIDResult from "./TaxonUUIDResult"
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
    const [changeRequested, setChangeRequested] = useState(false)
    if (!image) {
        return null
    }
    return (
        <DialogueScreen>
            <ImageContext.Provider value={uuid}>
                <FileView src={src} mode="dark" />
                {!specific && !image.submitted && src && (
                    <>
                        <p>
                            <strong>Looks great!</strong> What is it?
                        </p>
                        <p>(Please be as specific as possible.)</p>
                    </>
                )}
                {!specific && image.submitted && src && (
                    <>
                        <p>So, what is it?</p>
                        <p>(Please be as specific as possible.)</p>
                    </>
                )}
                {(!specific || changeRequested) && (
                    <Form
                        onComplete={handleFormComplete}
                        placeholder="Species or other taxonomic group"
                        suggestion={suggestionText}
                    />
                )}
                <br />
                {specific && (
                    <p>
                        Assigned to{" "}
                        <strong>
                            <NameView value={specific.names[0]} />
                        </strong>
                        .
                        {!changeRequested && (
                            <>
                                {" "}
                                <a className="text" onClick={() => setChangeRequested(true)}>
                                    Change it?
                                </a>
                            </>
                        )}
                    </p>
                )}
                {(!specific || changeRequested) && (
                    <TaxonUUIDResult
                        onCancel={handleResultsCancel}
                        onComplete={handleComplete}
                        searchTerm={searchTerm}
                    />
                )}
                {specific && (
                    <AnchorLink key="completeLink" className="cta" href={`/edit/${encodeURIComponent(uuid)}`}>
                        All set.
                    </AnchorLink>
                )}
            </ImageContext.Provider>
        </DialogueScreen>
    )
}
export default Taxonomy
