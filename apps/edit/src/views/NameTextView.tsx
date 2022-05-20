import { NomenPart } from "parse-nomen"
import React, { Fragment, FC } from "react"

export interface Props {
    name: readonly NomenPart[]
    short?: boolean
}
const NameTextView: FC<Props> = ({ name, short }) => {
    const parts = short
        ? name.filter(part => part.class !== "citation" && part.class !== "comment" && part.class !== "rank")
        : name
    return (
        <>
            {parts.map((part, index) => (
                <Fragment key={index}>
                    {index > 0 && " "}
                    <span className={part.class}>{part.text}</span>
                </Fragment>
            ))}
        </>
    )
}
export default NameTextView
