import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useImage from "~/editing/hooks/useImage"
import ImageContext from "~/editing/ImageContext"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import LoadingState from "../LoadingState"
import Status from "./Status"
import useRedirect from "./useRedirect"
import View from "./View"
export type Props = {
    uuid: UUID
}
const Editor: FC<Props> = ({ uuid }) => {
    const image = useImage(uuid)
    const { pending, redirecting } = useRedirect(uuid)
    if (!image || pending || redirecting) {
        return <LoadingState>Checking contribution status…</LoadingState>
    }
    return (
        <DialogueScreen>
            <ImageContext.Provider value={uuid}>
                <View />
                <Status />
            </ImageContext.Provider>
        </DialogueScreen>
    )
}
export default Editor
