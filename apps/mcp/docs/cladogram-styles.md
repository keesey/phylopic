# Cladogram styles (MCP)

PhyloPic MCP does **not** render cladograms. It provides taxonomy, images, and these conventions so **agents** (or users with agents) can produce SVG and iterate.

| Style | Status | Reference |
|-------|--------|-----------|
| **Basic rectangular cladogram** | Supported — default starting point | [Below](#basic-rectangular-cladogram) |
| **Radial cladogram** | Supported — large tip counts | [Below](#radial-cladogram) |
| Time-scaled (branch lengths) | Not specified yet | Requires Newick with lengths and a chosen scale |

**MCP resources**

| URI | Content |
|-----|---------|
| `phylopic://docs/cladogram-guide` | Workflow (Newick, terminals, pick_image, attribution) |
| `phylopic://docs/cladogram-styles` | This catalog + basic layout rules |
| `phylopic://docs/cladogram-template.svg` | Minimal basic-style SVG skeleton |

**Reference layout code (optional):** `@phylopic/diagrams` implements **basic** rail/column layout (`basicCladogramLayout.ts`, measured node sizes) and **radial** tip angles and polar coordinates (`radialCladogramLayout.ts`, unit-tested). Agents port the same rules to their SVG pipeline.

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
- Pack tips so each node’s content clears the next (below-rail extent of one + above-rail extent of the next + clearance). When a **labeled** internal with a silhouette spans multiple tips, widen **evenly across those tip gaps** so its rail midpoint has room (`assignBasicCladogramRails` in `basicCladogramLayout.ts`). Unlabeled internals do not trigger this pass.

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
- **Tips with image:** incoming branch runs **horizontally on the child’s rail** (`y` = tip rail), from the vertical gutter to the **right edge** of the silhouette (after tip inset). Do **not** aim the last segment at the bottom of the `<image>` (that angles the rail upward in SVG coordinates).
- **Tips without image:** stop horizontal at column edge; label centered on rail with tip inset.
- **Root (no incoming branch):** draw the same ancestral rail segment from column left through the silhouette right edge.

**Typography (Newick labels only)**

- Use the tree **`label` verbatim** (from `parse_newick` or terminal list).
- **Scientific** names (typical Newick: capitalized genus/clade, binomials) → italic.
- **Vernacular** names written as plain lowercase in Newick (e.g. `birds`) → upright, not italic.
- Reference helper: `isVernacularNewickLabel` in `@phylopic/diagrams` (`newickLabelStyle.ts`).

**Measuring workflow (two-pass SVG)**

1. Pick font family and size (e.g. Georgia 12px).
2. For each labeled node, render invisible `<text>` (or off-screen) with the final string and font; read **width and height** from `getBBox()`.
3. **Square slots, bottom-aligned:** Use a **fixed square** for each tier (e.g. 48×48 tips, 40×40 internals). Fetch each **`vectorFile`** and read its SVG `viewBox`. Scale uniformly to fit inside the square (meet), center horizontally, and place the `<image>` so its **bottom** matches the square’s bottom (`bottomAlignArtInSquareSlot` in `@phylopic/diagrams`). Do **not** stretch the vector to the full square—external SVG refs often ignore `preserveAspectRatio` on a full-slot `<image>`. Position the square with its bottom just above the rail (`silhouetteTopY`). Layout uses the **slot size**, not the artwork’s aspect ratio.
4. Run layout with those measured widths/heights, then emit final SVG.

**Reference template:** `cladogram-template.svg` / `phylopic://docs/cladogram-template.svg`.

### SVG emission (reference pipeline)

After **`assignBasicCladogramRails`** and **`assignBasicCladogramColumnsFromTree`**, map layout coordinates to SVG with a fixed **page padding** (e.g. 24px horizontal, 16px vertical) and optional **vertical shift** so silhouettes above the topmost rail are not clipped (see [ViewBox](#viewbox-and-footer-height) below).

**Coordinate helpers** (names match experiment renderers; all `y` values add the same vertical offset before writing SVG):

| Helper | Meaning |
|--------|---------|
| `nodeX` | Column left + horizontal padding |
| `contentX` | `nodeX` + tip inset (`tipContentInset`) on tips only |
| `imgRight` | `contentX` + silhouette slot width when illustrated |
| `gutterX` | `nodeX` + `verticalGutterOffset(measures, theme)` — x of the vertical connector |
| `railExitX` | Right end of a node’s **own** horizontal rail: silhouette right edge if illustrated, else `nodeX` |

Rails use each node’s layout **`railY`** (from reference layout), not the top or bottom of the silhouette.

**Draw order:** polylines and root rail **first**, then per-node `<g>` groups (images and labels on top). Stroke e.g. `#333`, width ~1.5.

**Root rail (no parent):** for the root if it has children, one horizontal `<line>` on the root rail from `nodeX` to `railExitX` at `railY + offset`.

**Child branch polylines** (recursive from each internal node `n` to each child `c`):

Let `y1 = n.railY`, `y2 = c.railY`, `xOut = railExitX(n)`, `mid = gutterX(n)`. Build points in order (orthogonal segments only):

1. `(xOut, y1)` — along parent rail to the gutter  
2. `(mid, y1)` — into the gutter column  
3. `(mid, y2)` — vertical to child rail height  
4. **If `c` is internal (has children):** `(nodeX(c), y2)`, then `(railExitX(c), y2)` — child’s full ancestral rail segment  
5. **If `c` is a tip with silhouette:** `(imgRight(c), y2)` — horizontal **on `y2`**, not at image bottom  
6. **If `c` is a label-only tip:** `(nodeX(c), y2)` or `(contentX(c), y2)` consistent with tip inset  

Do not add extra points through label baselines or image boxes.

**Per-node groups:** one `<g id="{treeId}">` per illustrated or labeled node (unlabeled internals with only a silhouette still get a group). Wrap silhouettes in `<a href="https://www.phylopic.org/images/{uuid}">` (also `xlink:href`). Wrap labels in `<a href="https://www.phylopic.org/nodes/{nodeUuid}">`. Label text = tree **`label` verbatim**; escape `&` and `<` in XML.

| Node | `<image>` | `<text>` |
|------|-----------|----------|
| Illustrated (tip or internal) | Slot from `silhouetteTopY(railY, …)`; artwork via `bottomAlignArtInSquareSlot` inside the square slot | Baseline below rail: `railY + labelGap + ~0.85× label height` |
| Tip, no silhouette | — | `dominant-baseline="middle"` on **`railY`** (label centered on rail) |

Use the same font attributes as [Typography](#typography-newick-labels-only).

#### ViewBox and footer height

1. **Content bounds** before footer: min `y` = top of highest silhouette (or label-only tip box); max `y` = `contentBottomY(railY, measures, theme)` over all nodes; max `x` = max of silhouette right, label right, and `gutterX` over nodes, plus horizontal padding.  
2. **Normalize:** subtract a constant from all drawn `y` so the top content sits ~8px below `y=0` (apply the same shift to polylines and node groups). Initial `viewBox` height = content span + bottom padding.  
3. **Footer:** append `format_diagram_publication` footer fragment below the diagram with a gap (~16px). Expand `viewBox` height and set width to at least **`diagramWidthForPublication`** when the permalink line needs it. White background `<rect>` covering the full final `viewBox`.

Workflow details (picking images, permalinks) stay in **`cladogram-for-agents.md`**.

### License and attribution footer

Reserve **~40–80px** below the lowest label for the publication footer. Use **`format_diagram_publication`** for copy and SVG fragments.

| Element | Font |
|---------|------|
| Taxon labels on branches | Georgia, italic (scientific names) |
| License + attribution footer | **Roboto**, 12px (PhyloPic default body text) |

Place `#phylopic-diagram-footer` at the bottom of the `viewBox`. Include RDF **`metadata`** from the tool output. See **`cladogram-for-agents.md`** → License and attribution footer.

---

## Radial cladogram

**Circular layout** for phylogenies with many terminal nodes: the **root** sits at the **center**, **tips** lie on a **circle**, and branches are straight segments in the plane from parent to child anchor (equal-angle / fan tree). Good when a tall rectangular stack would be unreadable.

Reference: `radialCladogramLayout.ts` in `@phylopic/diagrams` (`assignRadialCladogramLayout`, `radialBranchEdgePath`, `radialBranchPoint`, `radialSilhouettePoint`, `radialLabelPoint`, `radialLabelRotationDeg`, `radialSilhouetteRotationDeg`).

### Layout principles

| Element | Rule |
|---------|------|
| Tip order | Same as basic style: depth-first, left-to-right siblings (`parse_newick` order) |
| Tip angles | **Contiguous sectors** per subtree (wedge width ∝ tip count), in **Newick DFS order**—same ordering as basic tips top-to-bottom, so clades do not interleave on the circle. Span `sweepAngle` (default **360°**) from **12 o'clock** (`startAngle = −π/2`). Each tip at the center of its leaf sector. |
| Internal angles | **Arithmetic mean** of immediate children’s angles |
| Depth / radius | **Default (`equalDepth`):** root at **r = 0**; terminals on **r = tipRadius**; internals on **r = (depth / maxDepth) × tipRadius**. **Optional (`branchLength`):** pass `radiusMode: 'branchLength'` to `assignRadialCladogramLayout`; sum Newick **branch lengths** along each path from the root, find the **maximum** root-to-tip total, and scale so that maximum equals **`tipRadius`**—every node’s **r = (pathLength / maxPath) × tipRadius** (shorter tips sit **inside** the outermost circle). With **labeled tips**, choose an **outer layout radius** (silhouette ring), then set **`tipRadius`** with `radialBranchTipRadiusForLabels` so the label band fits before silhouettes. Use `radialRadiusScaleFromLayout` when drawing edges and labels. |
| **Ancestral nodes** | **Never** labeled and **never** illustrated (no silhouettes on internals) |
| Tips | **Labels** and **silhouettes** on tips only |

**Placement on the rim**

- **Branch anchor** (`radialBranchPoint`): where the edge meets the tip on the tip circle.
- **Silhouette** (`radialSilhouettePoint` at **r = tipRadius + silhouetteOutset**): on a **larger circle** outside the tip circle, aligned with the tip or clade bearing. Use square slot + `bottomAlignArtInSquareSlot`; **`translate(rim) rotate(…)`** with `radialSilhouetteRotationDeg(θ)` (tip labels) or **`radialInnerRingSilhouetteRotationDeg(θ)`** in clade-key mode (same bottom-half flip as inner-ring clade labels).
- **Label** (`radialLabelPoint`): on the **same spoke** as the tip, just **outside** the tip circle (`tipRadius + labelOutset`). Use `radialLabelTextPlacement(θ)` for rotation and `text-anchor` ( **`start`** on the right half, **`end`** with **+180°** on the left so labels stay upright). `dominant-baseline="middle"`; text extends outward from the center.

**Edges (polar):** every **straight** segment is a **spoke** (fixed θ, passes through the center): `radialBranchEdgePath` draws `M… L…` from the parent’s depth circle to the child (or tip circle) on the **child’s bearing**. **Ancestral rails** are separate **arcs** on each internal node’s depth circle spanning **immediate children only** (`radialAncestralArcPath`, `radialImmediateChildAngleRange`). In clade-key mode, colour **both** spokes and arcs from the same rule: one clade colour when all descendant tips share a clade, neutral grey when subtrees mix clades. Draw arcs, then radials, then labels and images.

**Typography:** same Newick label rules as [basic](#typography-newick-labels-only) (`isVernacularNewickLabel`, Georgia, italic for scientific names).

### Large tip counts (clade key mode)

When there are **many** tips (rough guide: **> 48**, see `RADIAL_CLADE_KEY_TIP_THRESHOLD` in reference code):

1. **Omit** per-tip text labels on the figure.
2. Color **branches** by **major clade** (monochrome under each clade when possible). Assign colours with `tolColorAtIndex` / `tolColorPalette` from `@phylopic/diagrams` (Paul Tol schemes; default **`darkRainbow`**, or **`rainbow`** / **`muted`** via scheme name).
3. Place **silhouettes only for major clades** on the **outer circle** at each clade’s mean tip bearing, tinted to the **same clade colour** as the branches (`svgAlphaTintFilterDef` / SourceAlpha flood on the image). No per-tip silhouettes.
4. **Clade names** on the inner ring at the clade bearing (`radialInnerRingLabelRadius` + mean tip angle): **black**, **`text-anchor="middle"`** so the label center lies on the spoke, **`radialInnerRingLabelTextPlacement`** (tangent, +90° from tip-label bearing; flip on the **bottom** half so 6 o’clock stays upright). Link each label to the resolved taxon’s PhyloPic node page when `resolveLabelToNode` succeeds (same as tip labels).

**Choosing which clades to highlight:** PhyloPic nodes are a **parent/child hierarchy with titles**, not a fixed rank ladder—there are no kingdom / phylum / order (etc.) fields on PhyloPic nodes. External sources used in `search_nodes` (e.g. **GBIF**) do expose ranks and can help **resolve names** or match what the user asked for, but clade-key boundaries on the figure should come from **labeled internal nodes in the tree** (Newick or MCP-built hierarchy), an explicit **`assignRadialTipClades`** map (tip id → clade id), or deliberate agent choice of which named ancestors to feature—not from reading ranks off PhyloPic.

**Default automatic selection** (when you do not hand-pick clades): **`selectRadialLegendClades`** in `@phylopic/diagrams`. It keeps **labeled internal** nodes whose subtree has at least **`DEFAULT_RADIAL_LEGEND_MIN_TIPS`** (12) tips, drops the **entire tree** and **depth &lt; 2** nodes, sorts by **depth then tip count** (deepest / most specific first), then greedily takes up to **`DEFAULT_RADIAL_LEGEND_MAX_CLADES`** (28) **non-nested** clades. That heuristic matches large fish trees (e.g. Actinopterygii) well; override `minTipsUnder`, `maxLegendClades`, or `minDepth` when needed. Color each tip by the **deepest** selected ancestor clade on its path (`assignRadialTipClades` or the same rule in your renderer).

### SVG viewBox

1. Content is roughly **square**: shift the layout origin to the center of the `viewBox`. Size the **branch circle** inset from the outer silhouette radius when tips are labeled (see depth/radius row); use `radialOuterLayoutViewBoxHalfExtent` for modest padding beyond the outer ring. Clade-key mode (no tip labels) uses the branch circle at the full layout radius.
2. **Footer:** radial figures often place the publication footer **below** the circle (same `format_diagram_publication` rules as basic). Expand `viewBox` height for footer + gap (~16px).
3. White background `<rect>` over the final `viewBox`.

Workflow (Newick, `pick_image`, attribution) unchanged — see **`cladogram-for-agents.md`**.
