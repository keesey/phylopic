import { FC } from "react"
import Speech from "~/ui/Speech"
const BroaderParentPrompt: FC = () => {
    return (
        <Speech mode="system">
            <p>Sorry, I don&rsquo;t know that one. Maybe try a larger, more general group?</p>
        </Speech>
    )
}
export default BroaderParentPrompt
