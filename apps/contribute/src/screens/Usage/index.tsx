import { AnchorLink } from "@phylopic/ui"
import { isValidLicenseURL, UUID } from "@phylopic/utils"
import { FC, useMemo } from "react"
import useFileSource from "~/editing/useFileSource"
import useLicense from "~/editing/useLicense"
import useSpecific from "~/editing/useSpecific"
import useUsageComplete from "~/editing/hooks/useUsageComplete"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import FileView from "~/ui/FileView"
import NameView from "~/ui/NameView"
import Attribution from "./Attribution"
import License from "./License"
export type Props = {
    uuid: UUID
}
const Usage: FC<Props> = ({ uuid }) => {
    const { data: license } = useLicense(uuid)
    const { data: specific } = useSpecific(uuid)
    const { data: source } = useFileSource(uuid)
    const hasLicense = useMemo(() => isValidLicenseURL(license), [license])
    const complete = useUsageComplete(uuid)
    return (
        <DialogueScreen>
            <figure>
                <FileView src={source ?? "data:"} mode="dark" />
                <figcaption>
                    {specific && <NameView value={specific.name} />}
                    {!specific && (
                        <AnchorLink className="text" href={`/edit/${encodeURIComponent(uuid)}/nodes`}>
                            [No taxon selected.]
                        </AnchorLink>
                    )}
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
