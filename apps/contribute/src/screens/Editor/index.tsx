import { UUID } from "@phylopic/utils"
import { FC } from "react"
import useImage from "~/editing/hooks/useImage"
import ImageContext from "~/editing/ImageContext"
import Dialogue from "~/ui/Dialogue"
import LoadingState from "../LoadingState"
import Status from "./Status"
import View from "./View"
export type Props = {
    uuid: UUID
}
const Editor: FC<Props> = ({ uuid }) => {
    const image = useImage(uuid)
    if (!image) {
        return <LoadingState>Checking contribution status…</LoadingState>
    }
    return (
        <Dialogue>
            <ImageContext.Provider value={uuid}>
                <View />
                <Status />
            </ImageContext.Provider>
        </Dialogue>
    )
}
export default Editor
