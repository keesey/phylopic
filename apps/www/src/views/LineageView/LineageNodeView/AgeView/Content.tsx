import { NumberView } from "@phylopic/ui"
import { type FC } from "react"
import { type AgeResult } from "~/external/useNodeAge"
import UnitView from "./UnitView"
import getAgePresentation from "./getAgePresentation"
const Content: FC<{ ages: AgeResult["ages"]; isTerminal: boolean }> = ({ ages, isTerminal }) => {
    if (isTerminal && ages[0] !== ages[1]) {
        const presentations = ages.map(age => getAgePresentation(age))
        const sameUnit = presentations[0].years === presentations[1].years
        return (
            <>
                ~<NumberView value={presentations[0].value} />
                {sameUnit ? (
                    "–"
                ) : (
                    <>
                        <UnitView {...presentations[0]} />
                        {" – ~"}
                    </>
                )}
                <NumberView value={presentations[1].value} />
                <UnitView {...presentations[1]} />
            </>
        )
    }
    {
        const presentation = getAgePresentation(ages[0])
        return (
            <>
                ~<NumberView value={presentation.value} />
                <UnitView {...presentation} />
            </>
        )
    }
}
export default Content
