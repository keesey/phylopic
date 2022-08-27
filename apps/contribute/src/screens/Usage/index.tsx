import { isLicenseURL, isPublicDomainLicenseURL, UUID } from "@phylopic/utils"
import { FC, useMemo } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageMutator from "~/editing/hooks/useImageMutator"
import useImageNode from "~/editing/hooks/useImageNode"
import useImageSrc from "~/editing/hooks/useImageSrc"
import useContributor from "~/profile/useContributor"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_CHECK, ICON_HAND_POINT_RIGHT, ICON_PENCIL } from "~/ui/ICON_SYMBOLS"
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
const EMPTY: never[] = []
const Usage: FC<Props> = ({ uuid }) => {
    const image = useImage(uuid)
    const src = useImageSrc(uuid)
    const contributor = useContributor()
    const hasLicense = useMemo(() => isLicenseURL(image?.license), [image?.license])
    const complete = useMemo(() => {
        return image?.license && (image.attribution || isPublicDomainLicenseURL(image.license))
    }, [image?.attribution, image?.license])
    const specific = useImageNode(uuid, "specific")
    const mutate = useImageMutator(uuid)
    if (!image || !src) {
        return <LoadingState>One moment&hellip;</LoadingState>
    }
    return (
        <Dialogue>
            <Speech mode="user">
                <SpeechStack collapsible>
                    <FileView src={src} mode="light" />
                    {specific && (
                        <p>
                            This image shows{" "}
                            <strong>
                                <NameView value={specific.names[0]} />
                            </strong>
                            .
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
            <UserOptions>
                {hasLicense && !image.attribution && contributor?.name && (
                    <UserButton icon={ICON_HAND_POINT_RIGHT} onClick={() => mutate({ attribution: contributor.name })}>
                        I get the credit.
                    </UserButton>
                )}
                {hasLicense && image.attribution && (
                    <UserButton
                        danger
                        icon={ICON_PENCIL}
                        onClick={() => mutate({ submitted: false, attribution: null })}
                    >
                        Change the attribution.
                    </UserButton>
                )}
                {complete && (
                    <UserLinkButton icon={ICON_CHECK} href={`/edit/${encodeURIComponent(uuid)}`}>
                        All done.{!image.attribution && " No credit needed."}
                    </UserLinkButton>
                )}
            </UserOptions>
        </Dialogue>
    )
}
export default Usage
