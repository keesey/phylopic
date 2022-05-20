import { FC, useMemo } from "react"
export interface Props {
    value?: number
}
const DimensionView: FC<Props> = ({ value }) => {
    const [text, approximate] = useMemo<[string | undefined, boolean]>(() => {
        if (typeof value === "number" && isFinite(value)) {
            const displayedValue = Math.round(value)
            const approximate = value !== displayedValue
            return [displayedValue.toLocaleString("en"), approximate]
        }
        return [undefined, false]
    }, [value])
    if (!text) {
        return null
    }
    return (
        <>
            {approximate && "~"}
            {text}
        </>
    )
}
export default DimensionView
