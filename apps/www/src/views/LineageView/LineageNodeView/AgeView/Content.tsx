import { type FC } from "react"
import { type AgeResult } from "~/external/AgeResult"
import RECENT from "~/external/RECENT"
import AgePresentationView from "./AgePresentationView"
import getAgePresentation from "./getAgePresentation"
const areEquivalent = (a: number, b: number) => a === b || (isNaN(a) && isNaN(b))
const isRecent = (n: number) => isNaN(n) || n <= RECENT
const areRecentOrEquivalent = (a: number, b: number) => areEquivalent(a, b) || (isRecent(a) && isRecent(b))
const Content: FC<{ ages: AgeResult["ages"]; isTerminal: boolean }> = ({ ages, isTerminal }) => {
    const presentations = ages.map(age => getAgePresentation(age))
    const sameUnit = areEquivalent(presentations[0].years, presentations[1].years)
    if (isTerminal && !(sameUnit && areRecentOrEquivalent(presentations[0].value, presentations[1].value))) {
        return (
            <>
                <AgePresentationView presentation={presentations[0]} showTilde showUnit={!sameUnit} />
                {sameUnit ? "–" : " – "}
                <AgePresentationView presentation={presentations[1]} showTilde={!sameUnit} showUnit />
            </>
        )
    }
    return <AgePresentationView presentation={presentations[0]} showTilde showUnit />
}
export default Content
