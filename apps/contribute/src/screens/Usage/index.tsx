import { AnchorLink } from "@phylopic/ui"
import { isValidLicenseURL, UUID } from "@phylopic/utils"
import { FC, useMemo } from "react"
import useUsageComplete from "~/editing/hooks/steps/useUsageComplete"
import useImage from "~/editing/hooks/useImage"
import useImageNode from "~/editing/hooks/useImageNode"
import useImageSrc from "~/editing/hooks/useImageSrc"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import FileView from "~/ui/FileView"
import NameView from "~/ui/NameView"
import LoadingState from "../LoadingState"
import Attribution from "./Attribution"
import License from "./License"
export type Props = {
    uuid: UUID
}
const Usage: FC<Props> = ({ uuid }) => {
    const image = useImage(uuid)
    const src = useImageSrc(uuid)
    const hasLicense = useMemo(() => isValidLicenseURL(image?.license), [image?.license])
    const complete = useUsageComplete(uuid)
    const specific = useImageNode(uuid, "specific")
    if (!image) {
        return <LoadingState>One moment&hellip;</LoadingState>
    }
    return (
        <DialogueScreen>
            <figure>
                {src && <FileView src={src} mode="dark" />}
                <figcaption>
                    {
                        image?.specific ? (
                            specific ? <NameView value={specific.names[0]} /> : "…"
                        ) : (
                            <AnchorLink className="text" href={`/edit/${encodeURIComponent(uuid)}/nodes`}>
                                [No taxon selected.]
                            </AnchorLink>
                        )
                    }
                </figcaption>
            </figure>
            <p>How would you like to make your image available for reuse?</p>
            <License uuid={uuid} />
            {hasLicense && <Attribution key="attribution" uuid={uuid} />}
            {complete && (
                <AnchorLink key="completeLink" className="cta" href={`/edit/${encodeURIComponent(uuid)}`}>
                    I'm all done.
                </AnchorLink>
            )}
        </DialogueScreen>
    )
}
export default Usage
