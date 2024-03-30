import { type FC } from "react"
const UnitView: FC<{ text: string; title?: string }> = ({ text, title }) => {
    if (title) {
        return <abbr title={title}>{text}</abbr>
    }
    return <>{text}</>
}
export default UnitView
