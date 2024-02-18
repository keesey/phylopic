import { Node } from "@phylopic/api-models"
import { type FC } from "react"
import useNodeAge from "~/external/useNodeAge"
import Content from "./Content"
export interface Props {
    value?: Node
}
const AgeView: FC<Props> = ({ value }) => {
    const ageResult = useNodeAge(value ?? null)
    if (!ageResult || !value) {
        return null
    }
    return (
        <>
            <br />
            <small>
                (
                <a href={ageResult.source} title={ageResult.sourceTitle}>
                    <Content {...ageResult} isTerminal={value._links.childNodes.length === 0} />
                </a>
                )
            </small>
        </>
    )
}
export default AgeView
