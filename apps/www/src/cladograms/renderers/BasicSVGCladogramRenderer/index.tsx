import { useMemo, useState, type FC } from "react"
import { CladogramNode, type Cladogram } from "~/cladograms/models"
import Area from "./Area"
import Plotter from "./Plotter"
import NodeRenderer from "./NodeRenderer"
import ArcRenderer from "./ArcRenderer"
const DEFAULT_AREA = new Area(0, 0, 0, 0)
const isCladogramNode = (x: CladogramNode | null): x is CladogramNode => Boolean(x)
const BasicSVGCladogramRenderer: FC<Cladogram> = ({ graph, metadata }) => {
    const [group, setGroup] = useState<SVGGElement | null>(null)
    const plotter = useMemo(() => {
        if (group) {
            return new Plotter(graph, group.ownerDocument, group)
        }
    }, [graph, group])
    const area = plotter?.getArea() ?? DEFAULT_AREA
    return (
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width={`${area.width}px`}
            height={`${area.height}px`}
            viewBox={`0 0 ${area.width} ${area.height}`}
            preserveAspectRatio="xMidYMid meet"
        >
            <style>{`.arc{fill:none;stroke:black;stroke-width:0.5px}a[href]{cursor:pointer}a[href]:hover{opacity:0.8}`}</style>
            {/* :TODO: metadata */}
            <g ref={setGroup}>
                <g id="arcs">
                    {plotter
                        ? graph.arcs.map((arc, index) => (
                              <ArcRenderer
                                  key={index}
                                  arc={arc}
                                  areas={[plotter.getNodeArea(arc[0])!, plotter.getNodeArea(arc[1])!]}
                                  nodes={[graph.nodes[arc[0]]!, graph.nodes[arc[1]]!]}
                                  imageSize={64}
                              />
                          ))
                        : null}
                </g>
                <g id="nodes">
                    {plotter
                        ? graph.nodes
                              .filter(isCladogramNode)
                              .map((node, index) => (
                                  <NodeRenderer
                                      key={index}
                                      node={node}
                                      area={plotter.getNodeArea(index)!}
                                      imageSize={64}
                                  />
                              ))
                        : null}
                </g>
            </g>
        </svg>
    )
}
export default BasicSVGCladogramRenderer
