# Illustrated cladograms from Newick (agent guide)

**Status:** living document — extend as cladogram experiments teach us more. MCP tools stay read-only; **you** produce SVG.

**MCP resources**

| URI | Content |
|-----|---------|
| `phylopic://docs/cladogram-guide` | This guide (Markdown) |
| `phylopic://docs/cladogram-styles` | Style catalog (basic vs future variants) |
| `phylopic://docs/cladogram-template.svg` | Minimal basic-style SVG skeleton |

**Related:** prompts `cladogram_from_newick` / `cladogram_from_terminals`, tools `parse_newick`, `build_tree_from_terminals`, and `pick_image`, server instructions in `src/agentInstructions.ts`.

---

## Division of labor

| MCP provides | Agent provides |
|--------------|----------------|
| Tree hierarchy JSON (`parse_newick` or `build_tree_from_terminals`) | Layout (x/y or equivalent) |
| Per-node image pick (`pick_image`) or UUID from `search_nodes` | Branch geometry |
| License-filtered `vectorUrl`, attribution via `get_image` | Final SVG file |
| Exact-name resolution policy for labels | Label-only nodes when `image` is null (no placeholder graphic) |
| Style catalog + basic layout rules (`phylopic://docs/cladogram-styles`) | Measuring text/images and iterating on design |

There is **no** `render_cladogram_svg` tool. Optional reference logic for the **basic rectangular cladogram** lives in `src/cladogram/basicCladogramLayout.ts` (unit-tested; uses measured sizes you supply). Layout conventions are in **`cladogram-styles.md`**, not this workflow guide.

---

## Recommended workflow

### From a Newick string

1. **`parse_newick`** with the user’s Newick string (semicolon optional). **`label` strings and sibling order match the Newick** (left-to-right); use those labels verbatim for SVG text and for `pick_image` / `search_nodes`.

### From a list of terminal taxa (no Newick)

When the user names **tips only** (e.g. “humans, rice, seahorses”), use **`build_tree_from_terminals`** with **`labels`**. MCP resolves each name, loads **`get_lineage`** for every tip, and builds a **concestor-only** tree—the internal nodes where those terminals diverge, not every node on the full PhyloPic paths (e.g. five tips may yield `((hops,rice),(seahorses,(humans,toucans)))`, not hundreds of ranks). **Sibling order in the Newick:** branches with **fewer** terminals first; **alphabetical** (min tip label in the branch) breaks ties. The response includes **`newick`** (optional: **`parse_newick`** on that string for the usual pipeline), hierarchy JSON, and **`nodeUuidByTreeId`**. Internal nodes are **unlabeled concestors**. Then continue with **`pick_image`** as below—use **`node_uuid`** from **`nodeUuidByTreeId`** for labeled tips; for unlabeled internals use **`descendant_node_uuids`** from child UUIDs in **`nodeUuidByTreeId`**.

### Shared steps (Newick or terminals)

2. Read **`phylopic://docs/cladogram-styles`** and choose a style (default: **basic rectangular cladogram**).
3. Decide which nodes to illustrate (default: every **labeled** node, including internal clades, unless the user says tips-only). **Unlabeled** internal nodes can still get silhouettes when the user wants full illustration.
4. For each **labeled** node:
   - **Preferred:** `search_nodes` on the label → use **`phylopic.exactMatch`** or a node whose **title exactly matches** the label (case-insensitive) → `pick_image` with **`node_uuid`**.
   - **Shortcut:** `pick_image` with **`label`** (uses PhyloPic name search with exact-title priority). Use when labels are trusted scientific names from the tree.
   - **Homonyms / wrong clade:** when the node has **two or more resolved child UUIDs** in the tree, use **`pick_image`** with **`label`** plus **`descendant_node_uuids`** (child node UUIDs). MCP takes the MRCA of those children, walks **`get_lineage`** toward the root, and picks the **most leafward** node whose title matches the Newick label.
5. For each **unlabeled internal** node to illustrate:
   - In each child branch, find the **labeled subclade root** (first labeled node on the path from this node down).
   - Resolve those labels to node UUIDs first (with disambiguation on labeled nodes). Pass those **resolved child UUIDs** into **`pick_image`** with **`descendant_node_uuids`** only.
6. Apply **license filters** only when the user requires them (e.g. `filter_license_nc=false` for commercial-friendly output).
7. **Measure** silhouettes and labels (see **`phylopic://docs/cladogram-styles`** → [Basic rectangular cladogram](cladogram-styles.md#basic-rectangular-cladogram)), **layout**, write SVG.
8. Collect **attribution** from pick/get_image results; include in `<desc>` and/or visible credits if the user wants.
9. **Links:** wrap each label in `<a href="https://www.phylopic.org/nodes/{nodeUuid}">`. Wrap each silhouette in `<a href="https://www.phylopic.org/images/{imageUuid}">`. **SVG text must be the tree `label` only** (Newick or terminal list) — never substitute PhyloPic node titles.

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

### Attribution and collections

1. Collect every **image UUID** used in the SVG.
2. Call **`describe_image_set_usage`** for combined license URL and attribution copy (same rules as a PhyloPic collection usage page).
3. Put attribution in `<desc>`, a caption, or adjacent credits; link silhouettes to `https://www.phylopic.org/images/{uuid}` as usual.
4. Call **`create_collection`** with the same UUIDs when you want a collection page (`https://www.phylopic.org/collections/{uuid}`).
5. When attribution is **required**, call **`create_collection_permalink`** and cite the permalink URL for a short stable credit (www API; rate-limited).

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
- [x] Attribution via MCP collection tools (see above)
- [ ] Attribution presentation (footer vs credits file)

---

## What not to commit

- Full illustrated cladograms from experiments (outputs, not source of truth).
- Local **`apps/mcp/scripts/`** render helpers (gitignored) — use this guide and MCP resources instead.
