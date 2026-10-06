# Illustrated cladograms from Newick (agent guide)

**Status:** living document — extend as cladogram experiments teach us more. MCP supplies taxonomy, images, and publication helpers; **you** produce SVG.

**MCP resources**

| URI | Content |
|-----|---------|
| `phylopic://docs/cladogram-guide` | This guide (Markdown) |
| `phylopic://docs/cladogram-styles` | Style catalog (basic vs future variants) |
| `phylopic://docs/cladogram-template.svg` | Minimal basic-style SVG skeleton |

**Related:** prompts `cladogram_from_newick` / `cladogram_from_terminals`, tools `parse_newick`, `build_tree_from_terminals`, `build_tree_from_phylopic_subtree`, and `pick_image`, server instructions in `src/agentInstructions.ts`.

---

## Division of labor

| MCP provides | Agent provides |
|--------------|----------------|
| Tree hierarchy JSON (`parse_newick` or `build_tree_from_terminals`) | Layout (x/y or equivalent) |
| Per-node image pick (`pick_image`) or UUID from `search_nodes` | Branch geometry |
| License-filtered `vectorUrl`, `describe_image_set_usage`, `format_diagram_publication` | Final SVG file with license footer and metadata |
| Exact-name resolution policy for labels | Label-only nodes when `image` is null (no placeholder graphic) |
| Style catalog + basic layout rules (`phylopic://docs/cladogram-styles`) | Measuring text/images and iterating on design |

There is **no** `render_cladogram_svg` tool. Optional reference logic for the **basic rectangular cladogram** lives in `src/cladogram/basicCladogramLayout.ts` (unit-tested; uses measured sizes you supply). Layout conventions are in **`cladogram-styles.md`**, not this workflow guide.

---

## Recommended workflow

### From a Newick string

1. **`parse_newick`** with the user’s Newick string (semicolon optional). **`label` strings and sibling order match the Newick** (left-to-right); use those labels verbatim for SVG text and for `pick_image` / `search_nodes`.

### From a list of terminal taxa (no Newick)

When the user names **tips only** (e.g. “humans, rice, seahorses”), use **`build_tree_from_terminals`** with **`labels`**. MCP resolves each name, loads **`get_lineage`** for every tip, and builds a **concestor-only** tree—the internal nodes where those terminals diverge, not every node on the full PhyloPic paths (e.g. five tips may yield `((hops,rice),(seahorses,(humans,toucans)))`, not hundreds of ranks). **Sibling order in the Newick:** branches with **fewer** terminals first; **alphabetical** (min tip label in the branch) breaks ties. The response includes **`newick`** (optional: **`parse_newick`** on that string for the usual pipeline), hierarchy JSON, and **`nodeUuidByTreeId`**. Internal nodes are **unlabeled concestors**. Then continue with **`pick_image`** as below—use **`node_uuid`** from **`nodeUuidByTreeId`** for labeled tips; for unlabeled internals use **`descendant_node_uuids`** from child UUIDs in **`nodeUuidByTreeId`**.

### From a collection or permalink

Use **`build_tree_from_collection`** with **`collection_uuid`** or **`permalink_url`**. Each collection image’s **specific node** becomes a terminal (tip labels omit author/year citations); **`imageUuidByTreeId`** keeps the exact silhouettes. Cite **`sourcePermalinkUrl`** in **`format_diagram_publication`** when republishing (`attribution_mode: permalink`). **`pick_image`** on tips with **`image_uuid`** from **`imageUuidByTreeId`**; unlabeled internals as in [Shared steps](#shared-steps-newick-or-terminals).

### From a PhyloPic node hierarchy (not concestors)

When the user wants **PhyloPic’s parent/child links** (e.g. Dinosauria → Ornithischia/Saurischia → … through great-grandchildren), use **`build_tree_from_phylopic_subtree`** with **`root_label`** or **`root_node_uuid`**. Default **`max_tip_depth`** is **3** (tips at great-grandchild rank). Every node is **labeled**; **`nodeUuidByTreeId`** is authoritative—use **`pick_image`** with **`node_uuid`** (tips: default **`filter_clade`**; internal nodes: **`image_list: ancestral`** and **`exclude_node_uuids`** for the cladogram parent to cap the ancestral walk). This is **not** the same as **`build_tree_from_terminals`** (concestor-only) or hand-written Newick.

### Shared steps (Newick or terminals)

2. Read **`phylopic://docs/cladogram-styles`** and choose a style (default: **basic rectangular cladogram**).
3. Decide which nodes to illustrate (default: every **labeled** node, including internal clades, unless the user says tips-only). **Unlabeled** internal nodes can still get silhouettes when the user wants full illustration.
4. For each **labeled** node:
   - **Preferred:** `search_nodes` on the label → use **`phylopic.exactMatch`** or a node whose **title exactly matches** the label (case-insensitive) → `pick_image` with **`node_uuid`**.
   - **Shortcut:** `pick_image` with **`label`** (uses PhyloPic name search with exact-title priority). Use when labels are trusted scientific names from the tree.
   - **Terminal tips:** default list fallback uses **`filter_clade`**. **Ancestral nodes:** **`image_list: ancestral`** — on each step, **`filter_node`** (images whose general→specific tagged lineage includes that node), then **`filter_clade`**, then walk to ancestors until a hit; pass **`exclude_node_uuids`** with the **cladogram parent's** PhyloPic UUID to **stop** the walk there (no silhouette from the parent or from any ancestor above it).
   - **Homonyms / wrong clade:** when the node has **two or more resolved child UUIDs** in the tree, use **`pick_image`** with **`label`** plus **`descendant_node_uuids`** (child node UUIDs). MCP takes the MRCA of those children, walks **`get_lineage`** toward the root, and picks the **most leafward** node whose title matches the Newick label.
5. For each **unlabeled internal** node to illustrate:
   - In each child branch, find the **labeled subclade root** (first labeled node on the path from this node down).
   - Resolve those labels to node UUIDs first (with disambiguation on labeled nodes). Pass those **resolved child UUIDs** into **`pick_image`** with **`descendant_node_uuids`** and **`exclude_node_uuids`** set to the cladogram parent's PhyloPic UUID when known (uses **`image_list: ancestral`**).
6. Apply **license filters** only when the user requires them (e.g. `filter_license_nc=false` for commercial-friendly output).
7. **Measure** silhouettes and labels (see **`phylopic://docs/cladogram-styles`** → [Basic rectangular cladogram](cladogram-styles.md#basic-rectangular-cladogram)), **layout**, write SVG.
8. **`format_diagram_publication`** on all silhouette image UUIDs (see [License and attribution footer](#license-and-attribution-footer)).
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

Prefer **`search_nodes` → `phylopic.exactMatch`** for Newick labels that must be precise. **`Homo sapiens` ≠ `Homo (sapiens)`**. PhyloPic **`filter_name` is case-sensitive**; lowercase variants may work when mixed case 404s. **`pick_image` with `label`** accepts PhyloPic **synonym** matches (e.g. **Stomiiformes** → node titled **Stomiatiformes**) but rejects **`filter_name` fallbacks** that are not synonyms (e.g. **Alestidae** → **Trialestidae**). With resolved child UUIDs in the tree, resolutions must also be **ancestors of those children** (blocks cross-clade homonyms). Pass **`node_uuid`** when in doubt.

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
- Pad **viewBox** for space above the top silhouette, below the lowest label, and for the **license footer** (Roboto body text).
- Taxon **labels** use **Georgia** (italic); license and attribution footer use **Roboto** (same as default PhyloPic www body text).

### License and attribution footer

Required on **every** diagram that includes PhyloPic silhouettes.

1. Collect every **image UUID** used in the SVG.
2. Call **`format_diagram_publication`** (or **`describe_image_set_usage`** plus manual layout). Defaults:
   - **License:** `combinedLicenseUrl` from usage. The user may set **`license_url`** to a **more restrictive** license only (never more permissive than the combined license of the silhouettes).
   - **Attribution:** when `attributionRequired` is false, omit the attribution block (`null`). When true on **published** diagrams, use a **permalink** only (not collection page URLs): **`create_collection`** → **`create_collection_permalink`** → **`format_diagram_publication`** with **`attribution_mode: permalink`** and **`attribution_url`** set to `permalinkUrl`. Footer: "For attribution, see …" with a hyperlink. **`full_text`** is for drafts/previews only.
   - Optional **`user_attribution_note`** for the user's own work on the diagram (layout, synthesis, etc.).
3. **Visible footer** at the bottom of the SVG (inside expanded `viewBox`):
   - License line: **"This image is available under the \<license name\> license."** Use **`LICENSE_NAMES`** from `@phylopic/utils` for the link text; hyperlink to the license URL.
   - If attribution is required, add the attribution line(s) as above.
4. **`<desc>`:** include `publication.descText` from **`format_diagram_publication`**.
5. **`<metadata>`:** insert `publication.metadataXml` (structured license, attribution, **`dc:source`** links to `https://www.phylopic.org/images/{uuid}` for each silhouette, **`dc:creator`** PhyloPic.org).
6. Merge `publication.footerSvgFragment` (includes Roboto `@import` in `<defs>`) and translate the `#phylopic-diagram-footer` group to the bottom-left of the figure. Set SVG width to at least **`diagramWidthForPublication(contentWidth, horizontalPadding, publication)`** (or `max(contentWidth, publication.footerMinWidth + 2×padding)`) so single-line permalink footers are not clipped.

**`create_collection`** registers the UUID set (required before permalink minting). **`create_collection_permalink`** mints the credit URL to cite on published diagrams (www API; rate-limited). Do not link `https://www.phylopic.org/collections/{uuid}` on diagram footers.

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
- [x] License and attribution footer (`format_diagram_publication`)

---

## What not to commit

- Full illustrated cladograms from experiments (outputs, not source of truth).
- Local **`apps/mcp/scripts/`** render helpers (gitignored) write experiment SVGs to **`~/Downloads/experiments/`** — use this guide and MCP resources instead.
