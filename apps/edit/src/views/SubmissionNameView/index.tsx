import { Submission } from "@phylopic/source-models"
import { FC } from "react"
import IdentifierView from "../IdentifierView"
import NameRenderer from "../NameRenderer"
export type Props = {
    mode?: "full" | "short"
    submission: Submission
}
const SubmissionNameView: FC<Props> = ({ mode, submission }) => {
    if (submission.newTaxonName) {
        if (mode === "full" && submission.identifier) {
            return (
                <>
                    <NameRenderer value={submission.newTaxonName} /> (<IdentifierView value={submission.identifier} />)
                </>
            )
        }
        return <NameRenderer value={submission.newTaxonName} short={mode === "short"} />
    }
    if (submission.identifier) {
        return <IdentifierView value={submission.identifier} short={mode === "short"} />
    }
    return <>[incertae sedis]</>
}
export default SubmissionNameView
