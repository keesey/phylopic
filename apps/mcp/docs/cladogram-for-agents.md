# Illustrated cladograms from Newick (agent guide)

**Status:** living document — extend this file as cladogram experiments teach us more. MCP tools stay read-only; **you** produce SVG.

**MCP resources (same content):**

| URI | Content |
|-----|---------|
| `phylopic://docs/cladogram-guide` | This guide (Markdown) |
| `phylopic://docs/cladogram-template.svg` | Minimal SVG skeleton (layout only) |

**Related:** prompt `cladogram_from_newick`, tools `parse_newick` and `pick_image`, server instructions in `src/agentInstructions.ts`.

---

## Division of labor

| MCP provides | Agent provides |
|--------------|----------------|
| Tree hierarchy JSON (`parse_newick`) | Layout (x/y or equivalent) |
| Per-node image pick (`pick_image`) or UUID from `search_nodes` | Branch geometry |
| License-filtered `vectorUrl`, attribution via `get_image` | Final SVG file |
| Exact-name resolution policy for labels | Label-only nodes when `image` is null (no placeholder graphic) |

There is **no** `render_cladogram_svg` tool and no layout package in this repo.

---

## Recommended workflow

1. **`parse_newick`** with the user’s Newick string (semicolon optional).
2. Decide which **labeled** nodes to illustrate (default: every labeled node, including internal clades, unless the user says tips-only).
3. For each node:
   - **Preferred:** `search_nodes` on the label → use **`phylopic.exactMatch`** or a node whose **title exactly matches** the label (case-insensitive) → `pick_image` with **`node_uuid`**.
   - **Shortcut:** `pick_image` with **`label`** (uses PhyloPic name search with exact-title priority). Use when labels are trusted scientific names from the tree.
4. Apply **license filters** only when the user requires them (e.g. `filter_license_nc=false` for commercial-friendly output).
5. **Layout** the tree (see below) and write SVG.
6. Collect **attribution** from pick/get_image results; include in `<desc>` and/or visible credits if the user wants.

### Choosing alternate silhouettes

Default `pick_image` is the same as PhyloPic’s clade page order (primary when node-accurate, else first on page 0). Users may want a different illustration on the same node.

1. Resolve the node UUID (`search_nodes` / exact match).
2. **`find_images`** with `filter_clade` set to that UUID and the same license filters as the cladogram. Pages are 0-based; each item includes UUID and (with embed) **specificNode** title.
3. Pick one:
   - **`pick_image`** with `node_uuid` + **`clade_index`** (and optional **`clade_page`**), or
   - **`pick_image`** with **`image_uuid`** after choosing from the list, or
   - **`get_image`** for URLs/attribution if you already have the UUID from `find_images`.

Overrides skip the default primary / first-on-page policy. Document which nodes used alternates.

**Example:** Hominidae node `f96400c5-cab0-4a39-a878-62097ad2e620` — index `0` is the default clade sort; index `1` is another hominid silhouette (e.g. *Dryopithecus brancoi*) under the same filters.

### When `pick_image` returns `image: null`

- **Omit the `<image>`** for that node; keep the **label** (and branch geometry). Do not draw a placeholder box or icon substitute.
- Tell the user which taxa had no suitable silhouette under the chosen filters.
- **Do not** retry with a narrower subtaxon — `filter_clade` already includes subtaxa.
- **Do not** silently use a parent clade’s image unless the user asked for that policy.

---

## Taxonomy and names (lessons from experiments)

### Exact title match beats API list order

PhyloPic `filter_name` results are not always ordered by precision. Example: `homo sapiens` can return **`Homo (sapiens)`** (species group) before **`Homo sapiens`** (species). Using the first row maps the wrong node and can show silhouettes for other species in that group (e.g. *Homo rhodesiensis*).

**Rules:**

- Prefer **`search_nodes` → `phylopic.exactMatch`** for Newick labels that must be precise.
- **`Homo sapiens` ≠ `Homo (sapiens)`** — do not treat them as interchangeable.
- PhyloPic **`filter_name` is case-sensitive**; lowercase variants may work when mixed case 404s (`homo sapiens` vs `Homo sapiens`).
- Use **`external[].phylopic`** from `search_nodes` only when PhyloPic name search has **no** exact title match — external sources may use broader taxon concepts.

### `filter_clade` semantics

- Images are included for the node **and all descendant taxa**.
- Default illustration = **first item on page 0** of that clade list (PhyloPic sort = phylogenetic proximity on the silhouettes page).
- “Typical / iconic / representative” = **choose a different node UUID on purpose** via `search_nodes`, not a recovery trick after null.

---

## Layout (rectangular phylogram)

Experiments used a simple **left-to-root, tips stacked vertically** phylogram.

### Rail per node (silhouette / line / label)

Each labeled node has a horizontal **rail** y (`railY`):

```
  [silhouette]     ← entirely above the rail
  ─────────────    ← branch polylines run on the rail (horizontal segments)
  label            ← entirely below the rail
```

1. Assign **depth** → x (constant column pitch, e.g. 90px per level).
2. Assign **tips** to spaced rail y values; **internal** nodes at the midpoint of their children’s rails.
3. **Silhouette:** `<image>` with bottom edge above the rail (leave a few px gap). **Tips:** inset a small left margin from the column x (e.g. 8px). Ancestral nodes use the column x with no extra inset.
4. **Label:** With a silhouette, `<text>` below the rail (e.g. baseline `railY + 16`), at `columnX + tipMargin`. **Terminal node with no image:** place the label at `columnX + tipMargin`, vertically centered on the rail (`dominant-baseline="middle"`). The branch must **not** run under the text.
5. **Edges:** horizontal segments on **rails** only. From parent `(x + slotWidth, parentRail)` → vertical in the gutter → child rail; for **ancestral (internal) children**, continue the horizontal **unbroken** from `x_child` through the slot to `(x_child + slotWidth, childRail)` before descending to their children. **Root (and any ancestral node without an incoming branch):** draw the rail horizontal from **`columnX` through the slot to `(columnX + slotWidth)`** so the line reaches the left edge of the silhouette, not only the outgoing stub from the right. **Tips with an image:** extend the incoming horizontal to the **right edge** of the silhouette (`tipX + width`). **Tips without an image:** stop the horizontal at **`columnX`** (before the tip margin); leave the margin gap, then the label. Do not run lines through images or labels (draw branches first, then images and text).
6. Icon **slot width** when present: slightly smaller for internal nodes (e.g. 44px) vs tips (e.g. 52px). Use the same slot width for branch math even when there is no image; tips add the left margin on top of column x.
7. **No image:** tips — label vertically centered on the rail but offset right by `tipMargin`; horizontal stops at `columnX` so the line does not touch text. Internal nodes — label below the rail (same as when illustrated).
8. Pad **viewBox** for space above the top silhouette and below the lowest label.
9. **White background:** full-size `<rect fill="#ffffff"/>` behind content if the user wants opaque exports.

Scale spacing for large trees; there is no single canonical aspect ratio.

**Reference template:** `cladogram-template.svg` / `phylopic://docs/cladogram-template.svg`.

---

## SVG conventions

```xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 W H">
  <title>…</title>
  <desc>… attribution summary …</desc>
  <rect x="0" y="0" width="W" height="H" fill="#ffffff"/>
  <!-- polylines, then groups per node -->
  <g id="with-image">
    <image href="{vectorUrl}" x="…" y="{railY - gap - height}" width="…" height="…"/>
    <text x="…" y="{railY + labelOffset}" font-style="italic">{label}</text>
  </g>
  <g id="no-image-tip">
    <text x="…" y="{railY}" dominant-baseline="middle" font-style="italic">{label}</text>
  </g>
</svg>
```

- Use **`href`** on `<image>` (SVG2); `xlink:href` is optional for older viewers.
- Escape `&`, `<` in text labels.
- Prefer **`vectorUrl`** from pick results for crisp scaling.

---

## Example Newick (smoke test)

Used in unit tests and manual experiments (8 tips, labeled internals):

```text
((Pongo abelii,Pongo tapanuliensis,Pongo pygmaeus)Pongo,((Gorilla gorilla,Gorilla beringei)Gorilla,(Homo sapiens,(Pan troglodytes,Pan paniscus)Pan))Homininae)Hominidae
```

Do **not** treat any one rendered SVG of this tree as the canonical product — it is a stress test for resolution, licenses, and layout.

---

## Open / iteration backlog

Add notes here as experiments continue:

- [ ] Layout variants (circular, diagonal, time-scaled branches when Newick has branch lengths)
- [ ] Tip-only vs all-labeled-nodes policy wording for prompts
- [ ] Attribution presentation (footer text vs separate credits file)
- [ ] When to call `get_image` vs relying on `pick_image` embed fields
- [ ] Vernacular labels in Newick vs strict scientific-name resolution
- [ ] (your items)

---

## What not to commit

Full illustrated cladograms built during experiments are **outputs**, not source of truth. Keep them outside the repo (or discard) unless we deliberately add a **non-normative** gallery later. This guide and the small template are the maintained agent references.
