import { type FC } from "react"
import { CladogramText } from "~/cladograms/models"
const CladogramMetadataText: FC<{ text: CladogramText }> = ({ text }) => {
    if (typeof text === "string") {
        return <>{text}</>
    }
    return (
        <>
            {text.map((part, index) => (
                <span key={index} className={part.class}>
                    {part.text}
                </span>
            ))}
        </>
    )
}
export default CladogramMetadataText
