# Cladogram styles (MCP)

PhyloPic MCP does **not** render cladograms. It provides taxonomy, images, and these conventions so **agents** (or users with agents) can produce SVG and iterate.

| Style | Status | Reference |
|-------|--------|-----------|
| **Basic rectangular cladogram** | Supported — default starting point | [Below](#basic-rectangular-cladogram) |
| Radial / circular | Not specified yet | Experiment freely; share patterns in the guide backlog |
| Time-scaled (branch lengths) | Not specified yet | Requires Newick with lengths and a chosen scale |

**MCP resources**

| URI | Content |
|-----|---------|
| `phylopic://docs/cladogram-guide` | Workflow (Newick, terminals, pick_image, attribution) |
| `phylopic://docs/cladogram-styles` | This catalog + basic layout rules |
| `phylopic://docs/cladogram-template.svg` | Minimal basic-style SVG skeleton |

**Reference layout code (optional):** `apps/mcp/src/cladogram/basicCladogramLayout.ts` implements basic-style rail/column assignment from **measured** node sizes (used in unit tests). Agents may port the same rules to their SVG pipeline.

**Not in the repo:** one-off local render scripts and full illustrated outputs from experiments — keep those outside git unless we add a deliberate gallery later.

---

## Basic rectangular cladogram

Default **out-of-the-box** style: root on the left, tips stacked vertically, horizontal **rails** per node, vertical connectors in **gutters** between depth columns.

Users and agents should treat this as a **starting layout** — tweak spacing, fonts, and styling for publication-quality figures.

### Layout principles (use real sizes)

Do **not** guess label width from character count. Measure each label with the same font you will render (`getBBox()` on SVG `<text>`, `CanvasRenderingContext2D.measureText`, etc.) and pass those numbers into layout.

| Node | Width / height |
|------|----------------|
| Illustrated | At least the chosen `<image>` width and height |
| Labelled | At least the measured label width and height |
| Illustrated + labelled | Tall enough for image + gap + rail + gap + label |
| Unillustrated, unlabelled | **Zero** content width and height (still a branch point; no box) |
| Margins | Keep images and labels **off** vertical connectors (`gutterMargin` in reference code) |

**Vertical placement**

- **Tips:** assign rail `y` in **Newick left-to-right order** (same as `parse_newick` siblings and depth-first tips). First tip at the **top** of the figure (smaller SVG `y`); do **not** mirror rails after `parse_newick`.
- **Internal nodes:** rail `y` = **arithmetic mean** of the rail `y` values of **immediate children**.
- Pack tips so each node’s content clears the next (below-rail extent of one + above-rail extent of the next + clearance). Widen locally when a labeled internal sits between two tips so its midpoint has room (`assignBasicCladogramRails` in `basicCladogramLayout.ts`).

**Horizontal placement**

- Each **child column** starts immediately after its **parent’s** measured column extent (silhouette, label, stub, gutter margin). **Siblings** share the same `x`; **cousin** branches do not widen each other (do not use a single global x per tree depth).
- Draw the **vertical connector** one **gutter margin** past the right edge of the label (and past silhouette/stub when present), so text is never flush on the line.
- Reference: `assignBasicCladogramColumnsFromTree` in `basicCladogramLayout.ts`.

**Rail geometry (per node)**

```
  [silhouette]     ← above the rail
  ─────────────    ← horizontal branch segments on the rail
  label            ← below the rail (or centered on rail for label-only tips)
```

- **Edges:** polylines on rails only; do not run lines through images or labels (draw branches first, then images and text).
- **Ancestral nodes:** the horizontal rail is **continuous** — from the column left (`nodeX`) through the silhouette to its **right edge**, then (when descending to children) horizontally to the vertical gutter, never skipping the silhouette segment.
- **Tips with image:** incoming branch horizontal ends at the **right edge** of the silhouette (after tip inset).
- **Tips without image:** stop horizontal at column edge; label centered on rail with tip inset.
- **Root (no incoming branch):** draw the same ancestral rail segment from column left through the silhouette right edge.

**Typography (Newick labels only)**

- Use the tree **`label` verbatim** (from `parse_newick` or terminal list).
- **Scientific** names (typical Newick: capitalized genus/clade, binomials) → italic.
- **Vernacular** names written as plain lowercase in Newick (e.g. `birds`) → upright, not italic.
- Reference helper: `isVernacularNewickLabel` in `src/cladogram/newickLabelStyle.ts`.

**Measuring workflow (two-pass SVG)**

1. Pick font family and size (e.g. Georgia 12px).
2. For each labeled node, render invisible `<text>` (or off-screen) with the final string and font; read **width and height** from `getBBox()`.
3. **Square slots, bottom-aligned:** Use a **fixed square** for each tier (e.g. 48×48 tips, 40×40 internals). Fetch each **`vectorFile`** and read its SVG `viewBox`. Scale uniformly to fit inside the square (meet), center horizontally, and place the `<image>` so its **bottom** matches the square’s bottom (`bottomAlignArtInSquareSlot` in `silhouetteViewBox.ts`). Do **not** stretch the vector to the full square—external SVG refs often ignore `preserveAspectRatio` on a full-slot `<image>`. Position the square with its bottom just above the rail (`silhouetteTopY`). Layout uses the **slot size**, not the artwork’s aspect ratio.
4. Run layout with those measured widths/heights, then emit final SVG.

**Reference template:** `cladogram-template.svg` / `phylopic://docs/cladogram-template.svg`.
