import { Loader } from "@phylopic/ui"
import { FC, ReactNode } from "react"
import Dialogue from "~/ui/Dialogue"
import Speech from "~/ui/Speech"
export type Props = {
    children: ReactNode
}
const LoadingState: FC<Props> = ({ children }) => (
    <Dialogue>
        <Speech mode="system">
            <div>{children}</div>
            <Loader />
        </Speech>
    </Dialogue>
)
export default LoadingState
