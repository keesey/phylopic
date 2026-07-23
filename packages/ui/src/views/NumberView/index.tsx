import React from "react"
export type NumberViewProps = {
    value?: number
}
export const NumberView: React.FC<NumberViewProps> = ({ value }) => {
    const text = React.useMemo(
        () => (typeof value !== "number" || !isFinite(value) ? "" : value.toLocaleString("en")),
        [value],
    )
    return text.length ? <>{text}</> : null
}
