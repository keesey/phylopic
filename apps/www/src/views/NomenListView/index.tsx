import { Nomen } from "@phylopic/utils"
import { FC } from "react"
import BulletList from "~/ui/BulletList"
import NomenView from "../NomenView"
export interface Props {
    defaultText?: string
    short?: boolean
    value: readonly Nomen[]
}
const NomenListView: FC<Props> = ({ defaultText, short, value }) => {
    return (
        <BulletList inline>
            {value.map((name, index) => (
                <li key={index}>
                    <NomenView value={name} defaultText={defaultText} short={short} />
                </li>
            ))}
        </BulletList>
    )
}
export default NomenListView
