import { type FC } from "react"
import { CladogramText } from "~/cladograms/models"
export type Props = { href?: string; text: CladogramText }
const CladogramTextRenderer: FC<Props> = ({ href, text }) => {
    return (
        <text className="label" href={href} textAnchor="middle">
            {typeof text === "string"
                ? text
                : text.map((part, index) => (
                      <tspan key={index} className={part.class}>
                          {part.text}
                      </tspan>
                  ))}
        </text>
    )
}
export default CladogramTextRenderer
