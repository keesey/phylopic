import React from "react"
import { NumberView } from "../NumberView"
export type CountViewProps = {
    value?: number
}
export const CountView: React.FC<CountViewProps> = ({ value }) => {
    const integerValue = typeof value === "number" && isFinite(value) ? Math.round(value) : NaN
    if (!isFinite(integerValue)) {
        return null
    }
    return (
        <strong>
            <NumberView value={integerValue} />
        </strong>
    )
}
