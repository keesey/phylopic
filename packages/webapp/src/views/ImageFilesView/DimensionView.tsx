import { FC, useMemo } from "react"
export interface Props {
    fractionalDigits?: number
    value?: number
}
const DimensionView: FC<Props> = ({ fractionalDigits, value }) => {
    const [text, approximate] = useMemo<[string | undefined, boolean]>(() => {
        if (typeof value === "number" && isFinite(value)) {
            const baseText = value
                .toFixed(fractionalDigits ?? 1)
                .replace(/0+$/, "")
                .replace(/\.$/, "")
            const displayedValue = parseFloat(baseText)
            const approximate = value !== displayedValue
            return [displayedValue.toLocaleString("en"), approximate]
        }
        return [undefined, false]
    }, [value])
    const title = useMemo(
        () => (typeof value === "number" && isFinite(value) ? value.toLocaleString("en") + " pixels" : undefined),
        [value],
    )
    if (!text) {
        return null
    }
    return (
        <abbr title={title}>
            {approximate && "~"}
            {text}
        </abbr>
    )
}
export default DimensionView
