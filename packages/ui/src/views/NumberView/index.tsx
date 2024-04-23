import React from "react"
export type NumberViewProps = {
    value?: number
}
export const NumberView: React.FC<NumberViewProps> = ({ value }) => {
    const text = typeof value !== "number" || !isFinite(value) ? "" : value.toLocaleString("en")
    return text.length ? <>{text}</> : null
}
