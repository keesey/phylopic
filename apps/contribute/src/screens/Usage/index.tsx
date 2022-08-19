import { isValidLicenseURL, UUID } from "@phylopic/utils"
import { FC, useMemo } from "react"
import useUsageComplete from "~/editing/hooks/steps/useUsageComplete"
import useImage from "~/editing/hooks/useImage"
import useImageNode from "~/editing/hooks/useImageNode"
import useImageSrc from "~/editing/hooks/useImageSrc"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import UserLinkButton from "~/ui/UserLinkButton"
import UserOptions from "~/ui/UserOptions"
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
    if (!image || !src) {
        return <LoadingState>One moment&hellip;</LoadingState>
    }
    return (
        <Dialogue>
            <Speech mode="user">
                <FileView src={src} mode="light" />
                {specific && (
                    <p>
                        <NameView value={specific.names[0]} />
                    </p>
                )}
            </Speech>
            <Speech mode="system">
                <p>How would you like to make this image available for reuse?</p>
            </Speech>
            <License uuid={uuid} />
            {hasLicense && <Attribution key="attribution" uuid={uuid} />}
            {complete && (
                <UserOptions>
                    <UserLinkButton href={`/edit/${encodeURIComponent(uuid)}`}>All done.</UserLinkButton>
                </UserOptions>
            )}
        </Dialogue>
    )
}
export default Usage
