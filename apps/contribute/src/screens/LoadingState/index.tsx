import { FC, ReactNode } from "react"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
export type Props = {
    children: ReactNode
}
const ErrorState: FC<Props> = ({ children }) => (
    <DialogueScreen>
        <h2>Error!</h2>
        {children}
    </DialogueScreen>
)
export default ErrorState
