# Cladogram styles (MCP)

PhyloPic MCP does **not** render cladograms. It provides taxonomy, images, and these conventions so **agents** (or users with agents) can produce SVG and iterate.

| Style | Status | Reference |
|-------|--------|-----------|
| **Basic rectangular phylogram** | Supported — default starting point | [`cladogram-for-agents.md`](cladogram-for-agents.md#basic-rectangular-phylogram) |
| Radial / circular | Not specified yet | Experiment freely; share patterns in the guide backlog |
| Time-scaled (branch lengths) | Not specified yet | Requires Newick with lengths and a chosen scale |

**MCP resources**

| URI | Content |
|-----|---------|
| `phylopic://docs/cladogram-guide` | Full workflow + basic layout rules |
| `phylopic://docs/cladogram-styles` | This catalog |
| `phylopic://docs/cladogram-template.svg` | Minimal basic-style SVG skeleton |

**Reference layout code (optional):** `apps/mcp/src/cladogram/basicPhylogramLayout.ts` implements basic-style rail/column assignment from **measured** node sizes (used in unit tests). Agents may port the same rules to their SVG pipeline.

**Not in the repo:** one-off local render scripts and full illustrated outputs from experiments — keep those outside git unless we add a deliberate gallery later.
