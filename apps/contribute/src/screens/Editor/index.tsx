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
    const { data: license } = useLicense(uuid)
    const { data: attribution } = useAttribution(uuid)
    const { data: specific } = useSpecific(uuid)
    const { data: general } = useGeneral(uuid)
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
                        {specific ? <NomenView value={specific.name} /> : "[None Selected]"}
                        {general && specific && <NomenView value={general.name} />}
                    </dl>
                    <dt>Attribution</dt>
                    <dl>{attribution ?? "[Anonymous]"}</dl>
                    <dt>License</dt>
                    <dl>
                        {license ? (
                            <a href={license} className="text" target="_blank" rel="noopener noferrer">
                                {LICENSE_NAMES[license] ?? "[Unknown]"}
                            </a>
                        ) : (
                            "[None Selected]"
                        )}
                    </dl>
                </dl>
            </section>
        </DialogueScreen>
    )
}
export default Editor
