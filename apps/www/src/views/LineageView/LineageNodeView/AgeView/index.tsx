import { Node } from "@phylopic/api-models"
import { useContext, useEffect, type FC } from "react"
import useNodeAge from "~/external/useNodeAge"
import { AgesContext, useAgeResult, useIsTerminal } from "../../AgesProvider"
import Content from "./Content"
export interface Props {
    value?: Node
}
const AgeView: FC<Props> = ({ value }) => {
    const { uuid } = value ?? {}
    const ageResult = useNodeAge(value ?? null)
    const { dispatch } = useContext(AgesContext) ?? {}
    useEffect(() => {
        if (dispatch && uuid) {
            dispatch({ type: "SET", payload: { ageResult, uuid } })
        }
    }, [ageResult, dispatch, uuid])
    const displayedResult = useAgeResult(uuid)
    const terminal = useIsTerminal(uuid)
    if (!displayedResult || !value) {
        return null
    }
    return (
        <>
            <br />
            <small>
                (
                <a href={displayedResult.source} title={displayedResult.sourceTitle}>
                    <Content {...displayedResult} isTerminal={terminal} />
                </a>
                )
            </small>
        </>
    )
}
export default AgeView
