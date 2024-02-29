import { NumberView } from "@phylopic/ui"
import { type FC } from "react"
import UnitView from "./UnitView"
import { type AgePresentation } from "./getAgePresentation"
import RECENT from "~/external/RECENT"
const AgePresentationView: FC<{ presentation: AgePresentation; showTilde: boolean; showUnit: boolean }> = ({
    presentation,
    showTilde,
    showUnit,
}) => {
    if (isNaN(presentation.years)) {
        return <UnitView {...presentation} />
    }
    return (
        <>
            {showTilde && "~"}
            <NumberView value={presentation.value} />
            {showUnit && (
                <>
                    {" "}
                    <UnitView {...presentation} />
                </>
            )}
        </>
    )
}
export default AgePresentationView
