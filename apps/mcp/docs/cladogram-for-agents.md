# Illustrated cladograms from Newick (agent guide)

**Status:** living document — extend as cladogram experiments teach us more. MCP tools stay read-only; **you** produce SVG.

**MCP resources**

| URI | Content |
|-----|---------|
| `phylopic://docs/cladogram-guide` | This guide (Markdown) |
| `phylopic://docs/cladogram-styles` | Style catalog (basic vs future variants) |
| `phylopic://docs/cladogram-template.svg` | Minimal basic-style SVG skeleton |

**Related:** prompt `cladogram_from_newick`, tools `parse_newick` and `pick_image`, server instructions in `src/agentInstructions.ts`.

---

## Division of labor

| MCP provides | Agent provides |
|--------------|----------------|
| Tree hierarchy JSON (`parse_newick`) | Layout (x/y or equivalent) |
| Per-node image pick (`pick_image`) or UUID from `search_nodes` | Branch geometry |
| License-filtered `vectorUrl`, attribution via `get_image` | Final SVG file |
| Exact-name resolution policy for labels | Label-only nodes when `image` is null (no placeholder graphic) |
| Style catalog + basic layout conventions (this doc) | Measuring text/images and iterating on design |

There is **no** `render_cladogram_svg` tool. Optional reference logic for the **basic** style lives in `src/cladogram/basicPhylogramLayout.ts` (unit-tested; uses measured sizes you supply).

---

## Recommended workflow

1. **`parse_newick`** with the user’s Newick string (semicolon optional). **`label` strings and sibling order match the Newick** (left-to-right); use those labels verbatim for SVG text and for `pick_image` / `search_nodes`.
2. Read **`phylopic://docs/cladogram-styles`** and choose a style (default: **basic rectangular phylogram**).
3. Decide which nodes to illustrate (default: every **labeled** node, including internal clades, unless the user says tips-only). **Unlabeled** internal nodes can still get silhouettes when the user wants full illustration.
4. For each **labeled** node:
   - **Preferred:** `search_nodes` on the label → use **`phylopic.exactMatch`** or a node whose **title exactly matches** the label (case-insensitive) → `pick_image` with **`node_uuid`**.
   - **Shortcut:** `pick_image` with **`label`** (uses PhyloPic name search with exact-title priority). Use when labels are trusted scientific names from the tree.
   - **Homonyms / wrong clade:** when the node has **two or more resolved child UUIDs** in the tree, use **`pick_image`** with **`label`** plus **`descendant_node_uuids`** (child node UUIDs). MCP takes the MRCA of those children, walks **`get_lineage`** toward the root, and picks the **most leafward** node whose title matches the Newick label.
5. For each **unlabeled internal** node to illustrate:
   - In each child branch, find the **labeled subclade root** (first labeled node on the path from this node down).
   - Resolve those labels to node UUIDs first (with disambiguation on labeled nodes). Pass those **resolved child UUIDs** into **`pick_image`** with **`descendant_node_uuids`** only.
6. Apply **license filters** only when the user requires them (e.g. `filter_license_nc=false` for commercial-friendly output).
7. **Measure** silhouettes and labels (see [Basic rectangular phylogram](#basic-rectangular-phylogram)), **layout**, write SVG.
8. Collect **attribution** from pick/get_image results; include in `<desc>` and/or visible credits if the user wants.
9. **Links:** wrap each label in `<a href="https://www.phylopic.org/nodes/{nodeUuid}">`. Wrap each silhouette in `<a href="https://www.phylopic.org/images/{imageUuid}">`. **SVG text must be the Newick `label` only** — never substitute PhyloPic node titles.

### Choosing alternate silhouettes

Default `pick_image` is the same as PhyloPic’s clade page order (primary when node-accurate, else first on page 0). Users may want a different illustration on the same node.

1. Resolve the node UUID (`search_nodes` / exact match).
2. **`find_images`** with `filter_clade` set to that UUID and the same license filters as the cladogram. Pages are 0-based.
3. Pick one via **`pick_image`** with `clade_index` / `clade_page` or **`image_uuid`**, or **`get_image`** for URLs/attribution.

### When `pick_image` returns `image: null`

- **Omit the `<image>`** for that node; keep the **label** (and branch geometry). Do not draw a placeholder.
- Tell the user which taxa had no suitable silhouette under the chosen filters.
- **Do not** retry with a narrower subtaxon — `filter_clade` already includes subtaxa.

---

## Taxonomy and names (lessons from experiments)

### Exact title match beats API list order

Prefer **`search_nodes` → `phylopic.exactMatch`** for Newick labels that must be precise. **`Homo sapiens` ≠ `Homo (sapiens)`**. PhyloPic **`filter_name` is case-sensitive**; lowercase variants may work when mixed case 404s.

### `filter_clade` semantics

- Images are included for the node **and all descendant taxa**.
- Default illustration = **first item on page 0** of that clade list.

---

## Basic rectangular phylogram

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
- Pack tips so each node’s content clears the next (below-rail extent of one + above-rail extent of the next + clearance). Widen locally when a labeled internal sits between two tips so its midpoint has room (`assignBasicPhylogramRails` in `basicPhylogramLayout.ts`).

**Horizontal placement**

- Each **child column** starts immediately after its **parent’s** measured column extent (silhouette, label, stub, gutter margin). **Siblings** share the same `x`; **cousin** branches do not widen each other (do not use a single global x per tree depth).
- Draw the **vertical connector** at the end of the parent column (before the gutter margin) so long labels end before the line.
- Reference: `assignBasicPhylogramColumnsFromTree` in `basicPhylogramLayout.ts`.

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

- Use the **`label` from `parse_newick` verbatim**.
- **Scientific** names (typical Newick: capitalized genus/clade, binomials) → italic.
- **Vernacular** names written as plain lowercase in Newick (e.g. `birds`) → upright, not italic.
- Reference helper: `isVernacularNewickLabel` in `src/cladogram/newickLabelStyle.ts`.

**Measuring workflow (two-pass SVG)**

1. Pick font family and size (e.g. Georgia 12px).
2. For each labeled node, render invisible `<text>` (or off-screen) with the final string and font; read **width and height** from `getBBox()`.
3. Set `<image width="…" height="…">` from your chosen display size (often smaller for internal nodes than tips).
4. Run layout with those measured widths/heights, then emit final SVG.

**Reference template:** `cladogram-template.svg` / `phylopic://docs/cladogram-template.svg`.

---

## SVG conventions

```xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 W H">
  <title>…</title>
  <desc>… attribution summary …</desc>
  <rect x="0" y="0" width="W" height="H" fill="#ffffff"/>
  <!-- polylines, then groups per node -->
</svg>
```

- Escape `&`, `<` in text labels.
- Prefer **`vectorUrl`** from pick results for crisp scaling.
- Pad **viewBox** for space above the top silhouette and below the lowest label.

---

## Example Newick (smoke test)

```text
((Pongo abelii,Pongo tapanuliensis,Pongo pygmaeus)Pongo,((Gorilla gorilla,Gorilla beringei)Gorilla,(Homo sapiens,(Pan troglodytes,Pan paniscus)Pan))Homininae)Hominidae
```

Do **not** treat any one rendered SVG of this tree as canonical — it is a stress test for resolution, licenses, and layout.

---

## Open / iteration backlog

- [ ] Radial / circular style spec
- [ ] Time-scaled branches when Newick has lengths
- [ ] Tip-only vs all-labeled-nodes policy wording for prompts
- [ ] Attribution presentation (footer vs credits file)

---

## What not to commit

- Full illustrated cladograms from experiments (outputs, not source of truth).
- Local **`apps/mcp/scripts/`** render helpers (gitignored) — use this guide and MCP resources instead.
