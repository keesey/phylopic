import React, { FC } from "react"
import { Vertex } from "./Vertex"
import VertexView from "./VertexView"

export interface Props {
    vertices: readonly Vertex[]
}
const VertexGroup: FC<Props> = ({ vertices }) => (
    <g>
        {vertices.map(vertex => (
            <VertexView key={vertex.uuid} vertex={vertex} />
        ))}
    </g>
)
export default VertexGroup
