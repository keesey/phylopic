import { Loader } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { FC, useCallback, useState } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageMutator from "~/editing/hooks/useImageMutator"
import useImageNode from "~/editing/hooks/useImageNode"
import useImageSrc from "~/editing/hooks/useImageSrc"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_CHECK, ICON_X } from "~/ui/ICON_SYMBOLS"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
import NodeForm from "./NodeForm"
export type Props = {
    uuid: UUID
}
const Assignment: FC<Props> = ({ uuid }) => {
    const image = useImage(uuid)
    const src = useImageSrc(uuid)
    const specific = useImageNode(uuid, "specific")
    const [changeRequested, setChangeRequested] = useState(false)
    const mutate = useImageMutator(uuid)
    const handleComplete = useCallback(
        (uuid: UUID) => {
            setChangeRequested(false)
            mutate({ general: null, specific: uuid })
        },
        [mutate],
    )
    if (!image) {
        return null
    }
    return (
        <Dialogue>
            {src && (
                <Speech mode="user">
                    <FileView src={src} mode="light" />
                </Speech>
            )}
            {(!src || (image.specific && !specific)) && (
                <Speech mode="system">
                    <p>Loading&hellip;</p>
                    <Loader />
                </Speech>
            )}
            {!image.specific && src && (
                <>
                    <Speech mode="system">
                        <p>
                            <strong>Looks great!</strong> What is it?
                        </p>
                        <p>
                            <small>(Please be as specific as possible.)</small>
                        </p>
                    </Speech>
                    <NodeForm key="nodeForm" onComplete={handleComplete} />
                </>
            )}
            {image.specific && src && specific && (
                <>
                    <Speech mode="system">
                        <p>
                            So this is <NameView value={specific.names[0]} />?
                        </p>
                    </Speech>
                    {!changeRequested && (
                        <UserOptions>
                            <UserLinkButton icon={ICON_CHECK} href={`/edit/${encodeURIComponent(uuid)}`}>
                                Yep.
                            </UserLinkButton>
                            <UserButton danger icon={ICON_X} onClick={() => setChangeRequested(true)}>
                                Nope.
                            </UserButton>
                        </UserOptions>
                    )}
                    {changeRequested && (
                        <>
                            <Speech mode="user">Nope.</Speech>
                            <Speech mode="system">Really??? What is it, then?</Speech>
                            <NodeForm key="nodeForm" onComplete={handleComplete} />
                        </>
                    )}
                </>
            )}
        </Dialogue>
    )
}
export default Assignment
