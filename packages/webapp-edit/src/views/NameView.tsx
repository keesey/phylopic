import { NomenPart } from "parse-nomen"
import React, { DetailedHTMLProps, HTMLAttributes, FC } from "react"
import NameTextView from "./NameTextView"

export type Props = Omit<DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "className"> & {
    name: readonly NomenPart[]
    short?: boolean
}
const NameView: FC<Props> = ({ name, short, ...spanProps }) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <span {...spanProps} className="nomen">
        <NameTextView name={name} short={short} />
    </span>
)
export default NameView
