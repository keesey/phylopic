import React, { FC } from "react"
import { Arc } from "./Arc"
import VERTEX_HEIGHT from "./VERTEX_HEIGHT"
import VERTEX_SPACING from "./VERTEX_SPACING"
import VERTEX_WIDTH from "./VERTEX_WIDTH"

export interface Props {
    arc: Arc
}
const ArcView: FC<Props> = ({ arc }) => {
    const x1 = arc[0].column * (VERTEX_WIDTH + VERTEX_SPACING[0]) + VERTEX_SPACING[0] + VERTEX_WIDTH / 2
    const x2 = arc[1].column * (VERTEX_WIDTH + VERTEX_SPACING[0]) + VERTEX_SPACING[0] + VERTEX_WIDTH / 2
    const y1 = arc[0].row * (VERTEX_HEIGHT + VERTEX_SPACING[1]) + VERTEX_SPACING[1] + VERTEX_HEIGHT / 2
    const y2 = arc[1].row * (VERTEX_HEIGHT + VERTEX_SPACING[1]) + VERTEX_SPACING[1] + VERTEX_HEIGHT / 2
    return <line x1={x1} x2={x2} y1={y1} y2={y2} />
}
export default ArcView
