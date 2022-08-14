import { FC } from "react"
import useImageCount from "~/editing/hooks/useImageCount"
import WideScreen from "~/pages/screenTypes/WideScreen"
import Greeting from "./Greeting"
const Welcome: FC = () => {
    const incomplete = useImageCount("incomplete")
    const submitted = useImageCount("submitted")
    const accepted = useImageCount("accepted")
    const withdrawn = useImageCount("withdrawn")
    return (
        <WideScreen>
            <Greeting />
            <dl>
                <dt>Incomplete</dt>
                <dd>{incomplete}</dd>
                <dt>Submitted</dt>
                <dd>{submitted}</dd>
                <dt>Accepted</dt>
                <dd>{accepted}</dd>
                <dt>Withdrawn</dt>
                <dd>{withdrawn}</dd>
            </dl>
        </WideScreen>
    )
}
export default Welcome
