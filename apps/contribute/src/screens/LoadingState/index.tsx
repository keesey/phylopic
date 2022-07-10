import { Loader } from "@phylopic/ui"
import { FC, ReactNode } from "react"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
export type Props = {
    children: ReactNode
}
const LoadingState: FC<Props> = ({ children }) => (
    <DialogueScreen>
        {children}
        <div>
            <Loader />
        </div>
    </DialogueScreen>
)
export default LoadingState
