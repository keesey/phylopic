import { NomenPart } from "parse-nomen"
import React, { FC } from "react"
import NameTextView from "./NameTextView"

export interface Props {
    names: ReadonlyArray<ReadonlyArray<NomenPart>>
}
const NameListView: FC<Props> = ({ names }) => {
    if (!names.length) {
        return null
    }
    return (
        <ul className="name-list">
            {names.map((name, index) => (
                <li className="nomen" key={index}>
                    <NameTextView name={name} />
                </li>
            ))}
        </ul>
    )
}
export default NameListView
