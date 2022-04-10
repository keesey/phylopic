import { Arc } from "../models/Arc"

export const normalizeArcs = (arcs: readonly Arc[]): readonly Arc[] =>
    [...new Set<string>(arcs.map(arc => arc.join(",")))].sort().map(s => s.split(",", 2) as unknown as Arc)
