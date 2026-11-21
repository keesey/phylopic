/**
 * Local experiment CLI → ~/Downloads/experiments/
 * Env: NEWICK or NEWICK_FILE, OUTPUT, TITLE, RADIAL_RADIUS_MODE=branchLength, TIP_RADIUS, …
 */
import {
    renderRadialCladogramFromTree,
    type RenderRadialCladogramFromTreeInput,
} from "../src/cladogram/renderRadialCladogramFromTree.js"
import { parseNewickToTree } from "../src/cladogram/parseNewick.js"
import type { RadialRadiusMode } from "@phylopic/diagrams"
import { PhyloPicClient } from "../src/client/PhyloPicClient.js"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

const NEWICK =
    process.env.NEWICK?.trim() ??
    (process.env.NEWICK_FILE ? readFileSync(process.env.NEWICK_FILE, "utf8").trim() : undefined)
if (!NEWICK) {
    throw new Error("Set NEWICK or NEWICK_FILE.")
}

const maxTips = Number(process.env.MAX_TIPS ?? "5000")
const labelOnly = process.env.LABEL_ONLY === "1" || process.env.LABEL_ONLY === "true"
const skipResolve =
    labelOnly ||
    process.env.SKIP_RESOLVE === "1" ||
    process.env.SKIP_RESOLVE === "true"
const outputName = process.env.OUTPUT?.trim() || "radial-cladogram.svg"
const outDir = join(homedir(), "Downloads", "experiments")
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, outputName)

const radialRadiusMode = (): RadialRadiusMode => {
    const raw = process.env.RADIAL_RADIUS_MODE?.trim().toLowerCase()
    if (raw === "branchlength" || raw === "branch_length" || raw === "weights") return "branchLength"
    if (process.env.USE_NEWICK_WEIGHTS === "1" || process.env.USE_NEWICK_WEIGHTS === "true") {
        return "branchLength"
    }
    return "equalDepth"
}

const normalizedNewick = NEWICK.replace(/\s*,\s*/g, ",")
const parsed = parseNewickToTree(normalizedNewick, { maxTips: Number.isFinite(maxTips) ? maxTips : 5000 })
const diagramTitle = process.env.TITLE?.trim() || parsed.root.label || "Radial cladogram"
const forceTipLabels = process.env.FORCE_TIP_LABELS === "1" || process.env.FORCE_TIP_LABELS === "true"
const maxLegendSpanDeg = process.env.MAX_LEGEND_SPAN_DEG?.trim()

const renderInput: RenderRadialCladogramFromTreeInput = {
    root: parsed.root,
    tipCount: parsed.tipCount,
    diagramTitle,
    radiusMode: radialRadiusMode(),
    outerLayoutRadius: Number(process.env.TIP_RADIUS ?? String(Math.max(420, parsed.tipCount * 0.95))),
    forceTipLabels,
    ...(maxLegendSpanDeg ? { maxLegendSpanDeg: Number(maxLegendSpanDeg) } : {}),
    tolScheme: (process.env.TOL_SCHEME?.trim() || "darkRainbow") as RenderRadialCladogramFromTreeInput["tolScheme"],
    skipResolve,
    labelOnly,
    onDiagnostic: line => console.error(line),
}

const { svg } = await renderRadialCladogramFromTree(new PhyloPicClient(), renderInput)
writeFileSync(outPath, svg)
console.error(`Wrote ${outPath}`)
