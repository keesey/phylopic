import { Arc } from "../types/Arc"
export const normalizeArcs = (arcs: readonly Arc[]): readonly Arc[] =>
    Array.from(new Set<string>(arcs.map(arc => arc.join(","))))
        .sort()
        .map(s => s.split(",", 2) as unknown as Arc)
