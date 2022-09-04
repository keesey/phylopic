import { Submission } from "@phylopic/source-models"
import { FC } from "react"
import NameRenderer from "~/screens/Assignment/NodeForm/NameRenderer"
import IdentifierView from "../IdentifierView"
export type Props = {
    mode?: "full" | "short"
    value: Pick<Submission, "identifier" | "newTaxonName">
}
const SubmissionNameView: FC<Props> = ({ mode, value }) => {
    if (!value.identifier) {
        return null
    }
    if (value.newTaxonName) {
        if (mode === "full" && value.identifier) {
            return (
                <>
                    <NameRenderer value={value.newTaxonName} /> (<IdentifierView value={value.identifier} short />)
                </>
            )
        }
        return <NameRenderer value={value.newTaxonName} short={mode === "short"} />
    }
    return <IdentifierView value={value.identifier} short={mode === "short"} />
}
export default SubmissionNameView
