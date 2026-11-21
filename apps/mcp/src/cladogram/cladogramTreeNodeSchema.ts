import { z } from "zod"
import type { CladogramTreeNode } from "./types.js"

export type CladogramTreeNodeInput = CladogramTreeNode

export const cladogramTreeNodeSchema = z.lazy(() =>
    z.object({
        id: z.string(),
        label: z.string().optional(),
        branchLength: z.number().optional(),
        children: z.array(cladogramTreeNodeSchema),
    }),
) as z.ZodType<CladogramTreeNodeInput>

export const parseCladogramTreeNode = (input: unknown): CladogramTreeNodeInput =>
    cladogramTreeNodeSchema.parse(input)
