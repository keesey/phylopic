import { Node, NodeLinks } from "@phylopic/api-models";
import { NumberView } from "@phylopic/ui";
import { FC } from "react";
import useNodeAge from "~/external/timetree.org/useNodeAge";
export interface Props {
    value?: Node
}
const AgeView: FC<Props> = ({ value }) => {
    const age = useNodeAge(value ?? null)
    if (age === null) {
        return null
    }
    return <>{" "}(<NumberView value={age} /> years ago)</>
}
export default AgeView
