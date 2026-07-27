import { FC, useMemo } from "react"
import convertQuickLinkNodeToCladogramGraph from "~/cladograms/converters/convertQuickLinkNodeToCladogramGraph"
import BasicSVGCladogramRenderer from "~/cladograms/renderers/BasicSVGCladogramRenderer"
import { QuickLinkNode } from "../QuickLinkNode"
export interface Props {
    node: QuickLinkNode
}
const QuickLinkCladogramView: FC<Props> = ({ node }) => {
    const cladogramGraph = useMemo(() => convertQuickLinkNodeToCladogramGraph(node), [node])
    return <BasicSVGCladogramRenderer graph={cladogramGraph} />
}
export default QuickLinkCladogramView
