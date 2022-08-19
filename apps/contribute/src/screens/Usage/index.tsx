import { isValidLicenseURL, UUID } from "@phylopic/utils"
import { FC, useMemo } from "react"
import useUsageComplete from "~/editing/hooks/steps/useUsageComplete"
import useImage from "~/editing/hooks/useImage"
import useImageMutator from "~/editing/hooks/useImageMutator"
import useImageNode from "~/editing/hooks/useImageNode"
import useImageSrc from "~/editing/hooks/useImageSrc"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_CHECK, ICON_PENCIL, ICON_X } from "~/ui/ICON_SYMBOLS"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import SpeechStack from "~/ui/SpeechStack"
import UserButton from "~/ui/UserButton"
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
    const mutate = useImageMutator(uuid)
    if (!image || !src) {
        return <LoadingState>One moment&hellip;</LoadingState>
    }
    return (
        <Dialogue>
            <Speech mode="user">
                <SpeechStack>
                    <FileView src={src} mode="light" />
                    {specific && (
                        <p>
                            This image shows <NameView value={specific.names[0]} />.
                        </p>
                    )}
                </SpeechStack>
            </Speech>
            <Speech mode="system">
                <p>
                    <strong>Cool.</strong> How would you like to make this image available for reuse?
                </p>
            </Speech>
            <License uuid={uuid} />
            {hasLicense && <Attribution key="attribution" uuid={uuid} />}
            {complete && (
                <UserOptions>
                    {hasLicense && (
                        <UserButton danger icon={ICON_PENCIL} onClick={() => mutate({ license: null })}>
                            Pick another license.
                        </UserButton>
                    )}
                    {image.attribution && (
                        <UserButton danger icon={ICON_PENCIL} onClick={() => mutate({ attribution: null })}>
                            Change the attribution.
                        </UserButton>
                    )}
                    <UserLinkButton icon={ICON_CHECK} href={`/edit/${encodeURIComponent(uuid)}`}>
                        All done.{!image.attribution && " No credit needed."}
                    </UserLinkButton>
                </UserOptions>
            )}
        </Dialogue>
    )
}
export default Usage
