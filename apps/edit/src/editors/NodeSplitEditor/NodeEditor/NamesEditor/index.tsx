import { Nomen, stringifyNormalized } from "@phylopic/utils"
import { FC } from "react"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
import NameView from "~/views/NameView"

export interface Props {
    names: readonly Nomen[]
}
const NamesEditor: FC<Props> = ({ names }) => (
    <BubbleList>
        {names.map(name => {
            const json = stringifyNormalized(name)
            return (
                <BubbleItem key={json} draggable onDragStart={event => event.dataTransfer.setData("Name", json)}>
                    <NameView name={name} />
                </BubbleItem>
            )
        })}
    </BubbleList>
)
export default NamesEditor
