import { Loader, NomenView } from "@phylopic/ui"
import { LICENSE_NAMES, UUID } from "@phylopic/utils"
import { FC } from "react"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import useAttribution from "../../editing/useAttribution"
import useRedirect from "./useRedirect"
import ImageView from "./ImageView"
import useLicense from "~/editing/useLicense"
import useSpecific from "~/editing/useSpecific"
import useGeneral from "~/editing/useGeneral"
export type Props = {
    uuid: UUID
}
const Editor: FC<Props> = ({ uuid }) => {
    const license = useLicense(uuid)
    const attribution = useAttribution(uuid)
    const specific = useSpecific(uuid)
    const general = useGeneral(uuid)
    // const sponsor = useSponsor(uuid)
    const { pending } = useRedirect(uuid)
    if (pending) {
        return (
            <DialogueScreen>
                <Loader />
            </DialogueScreen>
        )
    }
    return (
        <DialogueScreen>
            <ImageView uuid={uuid} />
            <section>
                <dl>
                    <dt>Taxonomy</dt>
                    <dl>
                        {specific.data?.name ? <NomenView value={specific.data.name} /> : "[None Selected]"}
                        {general.data?.name && specific.data?.name && <NomenView value={general.data.name} />}
                    </dl>
                    <dt>Attribution</dt>
                    <dl>{attribution.data ?? "[Anonymous]"}</dl>
                    <dt>License</dt>
                    <dl>
                        {license.data ? <a href={license.data}>{LICENSE_NAMES[license.data]}</a> : "[None Selected]"}
                    </dl>
                </dl>
            </section>
        </DialogueScreen>
    )
}
export default Editor
