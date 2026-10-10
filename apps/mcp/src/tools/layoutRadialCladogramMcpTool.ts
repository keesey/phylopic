import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import {
    buildRadialCladogramLayout,
    type RadialRadiusMode,
    type TolColorScheme,
} from "@phylopic/diagrams"
import { z } from "zod"
import { parseCladogramTreeNode } from "../cladogram/cladogramTreeNodeSchema.js"
import { toolFromError, toolSuccess } from "./toolResult.js"

const READ_ONLY = { readOnlyHint: true } as const

export const registerLayoutRadialCladogramTool = (server: McpServer) => {
    // @ts-expect-error TS2589 — tool inputSchema + layout geometry exceeds TypeScript inference depth
    server.registerTool(
        "layout_radial_cladogram",
        {
            description:
                "Compute radial cladogram geometry from a parsed tree: polar branch paths, clade-key vs labeled-tip mode, legend clades, and silhouette/label anchors. No SVG or image fetching—use with pick_image and renderRadialCladogramSvg (see @phylopic/diagrams) or assemble SVG from returned paths.",
            inputSchema: {
                root: z
                    .unknown()
                    .describe(
                        "Tree root from parse_newick (id, optional label and branchLength, children array of the same shape).",
                    ),
                tip_count: z.number().int().positive().describe("Tip count from parse_newick."),
                radius_mode: z
                    .enum(["equalDepth", "branchLength"])
                    .optional()
                    .describe("equalDepth (default) or branchLength (Newick weights)."),
                outer_layout_radius: z
                    .number()
                    .positive()
                    .optional()
                    .describe("Outer layout radius before label-band inset (labeled-tip mode)."),
                force_tip_labels: z
                    .boolean()
                    .optional()
                    .describe("Force per-tip labels even above the clade-key tip threshold."),
                max_legend_span_deg: z
                    .number()
                    .positive()
                    .optional()
                    .describe("Maximum angular span (degrees) for one rim legend clade (default 45)."),
                tol_scheme: z
                    .string()
                    .optional()
                    .describe("Paul Tol palette name (default darkRainbow)."),
            },
            annotations: READ_ONLY,
        },
        async ({
            root,
            tip_count,
            radius_mode,
            outer_layout_radius,
            force_tip_labels,
            max_legend_span_deg,
            tol_scheme,
        }) => {
            try {
                const tree = parseCladogramTreeNode(root)
                const geometry = buildRadialCladogramLayout(tree, {
                    tipCount: tip_count,
                    ...(radius_mode ? { radiusMode: radius_mode as RadialRadiusMode } : {}),
                    ...(outer_layout_radius !== undefined ? { outerLayoutRadius: outer_layout_radius } : {}),
                    ...(force_tip_labels !== undefined ? { forceTipLabels: force_tip_labels } : {}),
                    ...(max_legend_span_deg !== undefined ? { maxLegendSpanDeg: max_legend_span_deg } : {}),
                    ...(tol_scheme ? { tolScheme: tol_scheme as TolColorScheme } : {}),
                })
                return toolSuccess(
                    `Radial layout (${tip_count} tips, ${geometry.cladeKeyMode ? "clade-key" : "labeled tips"}).`,
                    { geometry: geometry as unknown },
                )
            } catch (error) {
                return toolFromError(error)
            }
        },
    )
}
