import { type FC } from "react"
import { type AgeResult } from "~/external/useNodeAge"
import AgePresentationView from "./AgePresentationView"
import getAgePresentation from "./getAgePresentation"
const Content: FC<{ ages: AgeResult["ages"]; isTerminal: boolean }> = ({ ages, isTerminal }) => {
    if (isTerminal && ages[0] !== ages[1]) {
        const presentations = ages.map(age => getAgePresentation(age))
        const sameUnit = presentations[0]?.years === presentations[1]?.years
        return (
            <>
                <AgePresentationView presentation={presentations[0]} showTilde showUnit={!sameUnit} />
                {sameUnit ? "–" : " – "}
                <AgePresentationView presentation={presentations[1]} showTilde={!sameUnit} showUnit />
            </>
        )
    }
    {
        const presentation = getAgePresentation(ages[0])
        return <AgePresentationView presentation={presentation} showTilde showUnit />
    }
}
export default Content
