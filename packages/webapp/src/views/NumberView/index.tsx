import { FC, useMemo } from "react"
export type Props = {
    value?: number
}
const NumberView: FC<Props> = ({ value }) => {
    const text = useMemo(
        () => (typeof value !== "number" || !isFinite(value) ? "" : value.toLocaleString("en")),
        [value],
    )
    return text.length ? <>{text}</> : null
}
export default NumberView
