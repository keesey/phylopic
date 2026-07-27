import { type CladogramNode, type CladogramGraph, CladogramText } from "~/cladograms/models"
import Area from "./Area"
import SVG_NAMESPACE from "~/svg/SVG_NAMESPACE"
export type PlotterSettings = Readonly<{
    hGap: number
    imageSize: number
    padding: number
    vGap: number
}>
const compareAreas = (a: Area, b: Area) => a.bottom - b.bottom
export default class Plotter {
    constructor(
        protected readonly graph: CladogramGraph,
        protected readonly document: Document,
        protected readonly svgElement: SVGElement,
        protected readonly settings: PlotterSettings = {
            hGap: 48,
            imageSize: 64,
            padding: 6,
            vGap: 6,
        },
    ) {
        this.untraversedSinks = []
        this.traversed = new Set<number>()
        this.nodeAreas = new Map<number, Area>()
        this.initAreas()
        this.xSort()
        this.ySort()
        this.removeOverlap()
        this.cleanUp()
    }
    public getArea() {
        return new Area(0, 0, this.maxRight, this.maxBottom)
    }
    public getNodeArea(index: number) {
        return this.nodeAreas.get(index)
    }
    protected maxBottom = 0
    protected maxRight = 0
    protected readonly nodeAreas: Map<number, Area>
    protected nextSinkY = 0
    protected readonly traversed: Set<number>
    protected readonly untraversedSinks: number[]
    protected arcsFrom(index: number) {
        return this.graph.arcs.filter(arc => arc[0] === index)
    }
    protected arcsTo(index: number) {
        return this.graph.arcs.filter(arc => arc[1] === index)
    }
    protected cleanUp() {
        this.traversed.clear()
        this.untraversedSinks.splice(0, this.untraversedSinks.length)
    }
    protected collapseNonSinkX(index: number) {
        if (this.traversed.has(index)) {
            return
        }
        this.traversed.add(index)
        const nodeArea = this.nodeAreas.get(index)
        if (!nodeArea) {
            return
        }
        const arcsFrom = this.arcsFrom(index)
        if (!(arcsFrom.length > 0)) {
            return
        }
        let x = Number.MAX_VALUE
        for (const arc of arcsFrom) {
            this.collapseNonSinkX(arc[0])
            const childArea = this.nodeAreas.get(arc[1])
            if (!childArea) {
                continue
            }
            const childX = childArea.x - this.settings.hGap - nodeArea.width
            x = Math.min(x, childX)
        }
        if (x != Number.MAX_VALUE) {
            this.nodeAreas.set(index, new Area(x, nodeArea.y, nodeArea.width, nodeArea.height))
        }
    }
    protected collapseNonSinksX() {
        this.graph.nodes
            .map((_, index) => index)
            .filter(index => !this.graph.arcs.some(arc => arc[0] === index))
            .forEach(index => this.collapseNonSinkX(index))
    }
    protected compareNodes(a: number, b: number) {
        if (a === b) {
            return 0
        }
        const areaA = this.nodeAreas.get(a)
        const areaB = this.nodeAreas.get(b)
        const rectangleCompare = areaA ? (areaB ? compareAreas(areaA, areaB) : 1) : areaB ? -1 : 0
        if (rectangleCompare !== 0) {
            return rectangleCompare
        }
        return a - b
    }
    protected createInitialNodeArea(node: CladogramNode | null): Area {
        const labelSize = node?.label ? this.getTextSize(node.label) : { width: 0, height: 0 }
        const imageSize = node?.imageUUID ? this.settings.imageSize : 0
        return new Area(0, 0, Math.max(labelSize.width, imageSize), labelSize.height + imageSize)
    }
    protected getTextSize(text: CladogramText) {
        const textElement = this.svgElement.ownerDocument.createElementNS(SVG_NAMESPACE, "text")
        if (typeof text === "string") {
            textElement.appendChild(this.document.createTextNode(text))
        } else {
            for (const markupNode of text) {
                const tspan = this.document.createElementNS(SVG_NAMESPACE, "tspan")
                if (markupNode.class) {
                    tspan.setAttribute("class", markupNode.class)
                    textElement.appendChild(document.createTextNode(markupNode.text))
                }
            }
        }
        this.svgElement.appendChild(textElement)
        const bBox = textElement.getBBox()
        textElement.remove()
        return {
            height: bBox.height,
            width: bBox.width,
        }
    }
    protected initAreas() {
        this.nodeAreas.clear()
        this.graph.nodes.forEach((node, index) => {
            this.nodeAreas.set(index, this.createInitialNodeArea(node))
        })
    }
    protected removeOverlap() {
        if (this.graph.nodes.length === 0) {
            return
        }
        const areaEntries = Array.from(this.nodeAreas.entries()).sort((a, b) => compareAreas(a[1], b[1]))
        for (let i = 1; i < areaEntries.length; ++i) {
            const areaA = areaEntries[i][1]
            for (let h = 0; h < i; ++h) {
                const areaB = areaEntries[h][1]
                if (areaB.intersects(areaA)) {
                    const offset = areaB.bottom + this.settings.vGap - areaA.y
                    for (const [index, area] of areaEntries.slice(i)) {
                        this.nodeAreas.set(index, new Area(area.x, area.y + offset, area.width, area.height))
                    }
                }
            }
        }
        const lastAreaEntry = areaEntries[areaEntries.length - 1]
        this.maxBottom = lastAreaEntry[1].bottom + this.settings.vGap
    }
    protected setNonSinkY(index: number) {
        if (this.traversed.has(index)) {
            return
        }
        this.traversed.add(index)
        const arcsFrom = this.arcsFrom(index)
        const n = arcsFrom.length
        if (n === 0) {
            return
        }
        let ySum = 0
        let numChildren = n
        for (const arc of arcsFrom) {
            this.setNonSinkY(arc[1])
            const childArea = this.nodeAreas.get(arc[1])
            if (!childArea) {
                numChildren--
            } else {
                ySum += childArea.centerY
            }
        }
        const nodeArea = this.nodeAreas.get(index)
        if (nodeArea) {
            this.nodeAreas.set(
                index,
                new Area(
                    nodeArea.x,
                    numChildren === 0 ? 0 : ySum / numChildren - nodeArea.height / 2,
                    nodeArea.width,
                    nodeArea.height,
                ),
            )
        }
    }
    protected setNonSinksY() {
        const nonSinks = new Set(
            this.graph.nodes.map((_, index) => index).filter(index => this.graph.arcs.some(arc => arc[0] === index)),
        )
        nonSinks.forEach(nonSink => this.setNonSinkY(nonSink))
    }
    protected setNonSourceX(index: number) {
        if (this.traversed.has(index)) {
            return
        }
        const arcsTo = this.arcsTo(index)
        let x = 0
        if (arcsTo.length > 0) {
            for (const arc of arcsTo) {
                this.setNonSourceX(arc[0])
                x = Math.max(x, (this.nodeAreas.get(arc[0])?.right ?? 0) + this.settings.hGap)
            }
        }
        const area = this.nodeAreas.get(index)
        if (area) {
            const newArea = new Area(x, 0, area.width, area.height)
            this.nodeAreas.set(index, newArea)
            this.maxRight = Math.max(this.maxRight, newArea.right + this.settings.hGap)
        }
        this.traversed.add(index)
    }
    protected setNonSourcesX() {
        this.graph.nodes.forEach((_, index) => this.setNonSourceX(index))
    }
    protected setSinksY(index: number) {
        this.setSinkSuccessorsY(index)
        const arcsTo = this.arcsTo(index)
        for (const arc of arcsTo) {
            this.setSinksY(arc[0])
        }
    }
    protected setSinkSuccessorsY(index: number) {
        if (this.traversed.has(index)) {
            return
        }
        this.traversed.add(index)
        const arcsFrom = this.arcsFrom(index)
        const n = arcsFrom.length
        const untraversedSinksIndex = this.untraversedSinks.indexOf(index)
        if (n === 0) {
            if (untraversedSinksIndex >= 0) {
                this.untraversedSinks.splice(untraversedSinksIndex, 1)
            }
            const area = this.nodeAreas.get(index)
            if (area) {
                this.nodeAreas.set(index, new Area(area.x, this.nextSinkY, area.width, area.height))
                this.nextSinkY += area.height + this.settings.vGap
            }
        } else if (n === 1) {
            this.setSinkSuccessorsY(arcsFrom[0][1])
        } else {
            arcsFrom
                .map(arc => arc[1])
                .sort((a, b) => this.compareNodes(a, b))
                .forEach(index => this.setSinkSuccessorsY(index))
        }
    }
    protected setSourcesX() {
        const sources = this.graph.nodes
            .map((_, index) => index)
            .filter(index => !this.graph.arcs.some(arc => arc[1] === index))
        for (const source of sources) {
            const area = this.nodeAreas.get(source)
            if (area) {
                this.nodeAreas.set(source, new Area(this.settings.hGap, this.settings.vGap, area.width, area.height))
            }
            this.traversed.add(source)
        }
    }
    protected xSort() {
        this.maxRight = 0
        this.maxBottom = 0
        this.traversed.clear()
        this.setSourcesX()
        this.setNonSourcesX()
        this.traversed.clear()
        this.collapseNonSinksX()
        this.traversed.clear()
    }
    protected ySort() {
        this.traversed.clear()
        this.untraversedSinks.splice(0, this.untraversedSinks.length)
        const sinks = this.graph.nodes
            .map((_, index) => index)
            .filter(index => !this.graph.arcs.some(arc => arc[0] === index))
        sinks.forEach(sink => this.untraversedSinks.push(sink))
        this.nextSinkY = this.settings.vGap
        while (this.untraversedSinks.length > 0) {
            const next = this.untraversedSinks.shift()
            if (typeof next === "number") {
                this.setSinksY(next)
            }
        }
        this.traversed.clear()
        this.setNonSinksY()
        this.traversed.clear()
    }
}
