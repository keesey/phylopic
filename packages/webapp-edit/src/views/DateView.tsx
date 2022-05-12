import { ISOTimestamp } from "@phylopic/utils"
import React, { FC } from "react"

export interface Props {
    datetime: ISOTimestamp
}
const DateView: FC<Props> = ({ datetime }) =>
    datetime ? (
        <time dateTime={datetime} title={datetime}>
            {new Date(datetime).toLocaleString()}
        </time>
    ) : null
export default DateView
