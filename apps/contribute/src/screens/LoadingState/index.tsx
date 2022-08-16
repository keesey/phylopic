import { Loader } from "@phylopic/ui"
import { FC, ReactNode } from "react"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import Dialogue from "~/ui/Dialogue"
import Speech from "~/ui/Speech"
export type Props = {
    children: ReactNode
}
const LoadingState: FC<Props> = ({ children }) => (
    <Dialogue>
        <Speech mode="system">{children}</Speech>
        <Loader />
    </Dialogue>
)
export default LoadingState
