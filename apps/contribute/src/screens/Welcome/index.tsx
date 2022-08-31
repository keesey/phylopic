import { Loader } from "@phylopic/ui"
import { FC, Fragment } from "react"
import useImageCount from "~/editing/useImageCount"
import Dialogue from "~/ui/Dialogue"
import Speech from "~/ui/Speech"
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
    const hasNothing = !hasAccepted && !hasIncomplete && !hasSubmitted && !hasWithdrawn
    return (
        <Dialogue>
            <Greeting />
            {pending && (
                <Speech mode="system" key="pending">
                    <p>Looking up your images…</p>
                    <Loader />
                </Speech>
            )}
            {!pending && (
                <Fragment key="content">
                    {hasNothing ? <Prompt /> : hasIncomplete ? <Incomplete /> : <Complete />}
                </Fragment>
            )}
        </Dialogue>
    )
}
export default Welcome
