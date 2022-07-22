import { LICENSE_NAMES, UUID } from "@phylopic/utils"
import { FC } from "react"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import ImageView from "./ImageView"
import useContribution from "./useContribution"
export type Props = {
    uuid: UUID
}
const Editor: FC<Props> = ({ uuid }) => {
    const [contribution, setContribution] = useContribution(uuid)
    return (
        <DialogueScreen>
            <ImageView uuid={uuid} />
            <section>
                <dl>
                    <dt>Attribution</dt>
                    <dl>{contribution.attribution ?? "[Anonymous]"}</dl>
                    <dt>License</dt>
                    <dl>
                        {contribution.license ? (
                            <a href={contribution.license}>{LICENSE_NAMES[contribution.license]}</a>
                        ) : (
                            "[None Selected]"
                        )}
                    </dl>
                    <dt>License</dt>
                </dl>
            </section>
        </DialogueScreen>
    )
}
export default Editor
