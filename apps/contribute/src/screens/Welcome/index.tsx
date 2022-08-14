import { Loader } from "@phylopic/ui"
import { FC, Fragment } from "react"
import useImageCount from "~/editing/hooks/useImageCount"
import FullScreen from "~/pages/screenTypes/FullScreen"
import WideScreen from "~/pages/screenTypes/WideScreen"
import Complete from "./Complete"
import Greeting from "./Greeting"
import Incomplete from "./Incomplete"
import Prompt from "./Prompt"
const Welcome: FC = () => {
    const accepted = useImageCount("accepted")
    const incomplete = useImageCount("incomplete")
    const submitted = useImageCount("submitted")
    const withdrawn = useImageCount("withdrawn")
    const hasAccepted = typeof accepted === "number" && accepted > 0
    const hasIncomplete = typeof incomplete === "number" && incomplete > 0
    const hasSubmitted = typeof submitted === "number" && submitted > 0
    const hasWithdrawn = typeof withdrawn === "number" && withdrawn > 0
    const pending =
        accepted === undefined || incomplete === undefined || submitted === undefined || withdrawn === undefined
    console.log(accepted, typeof accepted, hasAccepted)
    const hasNothing = !hasAccepted && !hasIncomplete && !hasSubmitted && !hasWithdrawn
    return (
        <FullScreen>
            <Greeting />
            {pending && (
                <div key="pending">
                    <p>Looking up your images…</p>
                    <Loader />
                </div>
            )}
            {!pending && (
                <Fragment key="content">
                    {hasNothing ? <Prompt /> : hasIncomplete ? <Incomplete /> : <Complete />}
                </Fragment>
            )}
        </FullScreen>
    )
}
export default Welcome
