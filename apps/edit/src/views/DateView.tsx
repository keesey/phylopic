import type { ISOTimestamp } from "@phylopic/utils"
import type { FC } from "react"

export interface Props {
    datetime: ISOTimestamp
}
const DateView: FC<Props> = ({ datetime }) =>
    datetime ? (
        <time dateTime={datetime} title={datetime}>
            {new Date(datetime).toLocaleString("en")}
        </time>
    ) : null
export default DateView
