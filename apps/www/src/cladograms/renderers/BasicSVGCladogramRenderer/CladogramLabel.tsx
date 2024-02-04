import { useMemo, type FC } from "react"
import { CladogramText, type Cladogram } from "~/cladograms/models"
const CladogramTextRenderer: FC<{ text: CladogramText }> = ({ text }) => {
    return (
        <text>
            {typeof text === "string" ? text : text.map(part => <tspan className={part.class}>{part.text}</tspan>)}
        </text>
    )
}
export default CladogramTextRenderer
