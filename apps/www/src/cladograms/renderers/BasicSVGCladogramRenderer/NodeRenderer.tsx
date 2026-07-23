import { type FC } from "react"
import { CladogramNode } from "~/cladograms/models"
import Area from "./Area"
import CladogramTextRenderer from "./CladogramLabel"
import clsx from "clsx"
const DEFAULT_AREA = new Area(0, 0, 0, 0)
export type Props = {
    area: Area
    imageSize: number
    node: CladogramNode
}
const NodeRenderer: FC<Props> = ({ area, imageSize, node }) => {
    if (!node.imageUUID && !node.label && !node.identifier) {
        return null
    }
    const href = node.identifier
        ? `https://www.phylopic.org/resolve/${node.identifier.map(part => encodeURIComponent(part)).join("/")}`
        : undefined
    // :TODO: metadata
    return (
        <g className="node" transform={getTranslate(area.x, area.y)}>
            <a href={href}>
                {node.imageUUID && (
                    <image
                        className="silhouette"
                        href={`https://images.phylopic.org/images/${encodeURIComponent(node.imageUUID)}/vector.svg`}
                        x={imageSize < area.width ? (area.width - imageSize) / 2 : 0}
                        height={`${imageSize}px`}
                        width={`${imageSize}px`}
                    />
                )}
                {node.label && (
                    <g
                        transform={getTranslate(
                            area.width / 2 +
                                (node.imageUUID && area.width < imageSize ? (imageSize - area.width) / 2 : 0),
                            area.height,
                        )}
                    >
                        <CladogramTextRenderer text={node.label} />
                    </g>
                )}
                {!node.imageUUID && !node.label && <circle x="4" y="4" r="8" />}
            </a>
        </g>
    )
}
const getTranslate = (x: number, y: number) => {
    if (!x && !y) {
        return undefined
    }
    return `translate(${x},${y})`
}
export default NodeRenderer
