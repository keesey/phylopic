import { FC, useMemo } from "react"
import NumberView from "../NumberView"
export type Props = {
    value?: number
}
const CountView: FC<Props> = ({ value }) => {
    const integerValue = useMemo(
        () => (typeof value === "number" && isFinite(value) ? Math.round(value) : NaN),
        [value],
    )
    if (!isFinite(integerValue)) {
        return null
    }
    return (
        <strong>
            <NumberView value={integerValue} />
        </strong>
    )
}
export default CountView
