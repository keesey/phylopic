import { Nomen } from "@phylopic/utils"
import React, { FC } from "react"
import NameView from "./NameView"

export interface Props {
    attribution: string | null
    name: Nomen
    sponsor: string | null
}
const ImageTitleView: FC<Props> = ({ attribution, name, sponsor }) => (
    <span>
        {name ? <NameView name={name} short /> : "Unassigned"}
        {" by "}
        {attribution || "Anonymous"}
        {sponsor ? ` (Sponsored by ${sponsor})` : null}
    </span>
)
export default ImageTitleView
