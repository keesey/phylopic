import { NomenPart } from "parse-nomen"
import { Fragment, FC } from "react"

export interface Props {
    name: readonly NomenPart[]
    short?: boolean
}
const NameTextView: FC<Props> = ({ name, short }) => {
    const parts = short
        ? name.filter(
              (part, index, array) =>
                  part.class === "scientific" ||
                  part.class === "vernacular" ||
                  part.class === "operator" ||
                  (part.class === "rank" && index < array.length - 1),
          )
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
