/** Shown to MCP clients at initialize; keep in sync with tool descriptions and README. */
export const MCP_AGENT_INSTRUCTIONS = `PhyloPic node and image workflow:

1. Do not infer scientific names, family names, or node UUIDs from general knowledge. PhyloPic's tree and vernacular names may differ from other sources.
2. Always start with search_nodes using the user's exact words (common or scientific), e.g. query "ants" not "Formicidae" unless the user said Formicidae.
3. Pick a node UUID from search_nodes: prefer phylopic.exactMatch or any node whose title exactly matches the query (case-insensitive). Do not substitute a related name (e.g. Homo (sapiens) when the user or Newick label said Homo sapiens). Use external[].phylopic only when PhyloPic name search has no exact title match. Use get_node to confirm before find_images.
4. Prefer the broadest PhyloPic node that fits the user's intent when multiple matches exist (e.g. a clade rather than a single species when they asked for a group).
5. Use find_images with filter_clade set to that UUID. filter_clade includes images tagged on that node and on any subtaxon (descendants)—not only exact matches. List page is 0-based (page=0 is first). Apply license filters only when the user asks.
6. Default: when the user does not specify a particular species or image, choose the first image on page 0 of that clade list. PhyloPic sorts clade images by phylogenetic proximity to the node (ancestral/default), matching the order on the node silhouettes page.
7. Override: if the user asks for a "typical", "iconic", "representative", or similar image, choose a narrower node via search_nodes first, then pick_image or find_images on that UUID—do not invent UUIDs from memory. That narrower UUID is a deliberate illustration choice, not a way to recover from null.
8. pick_image applies PhyloPic policy for a node: primaryImage when its specificNode matches, else first filter_clade hit on page 0, else no image.
9. When pick_image or find_images returns no image for a node, do not retry with a narrower subtaxon name or UUID to fill the gap—filter_clade on that node already searched subtaxa. Omit the silhouette (label-only in cladograms), tell the user, or relax license filters only if they allow; do not substitute a parent/ancestor silhouette unless the user asks for that policy.
10. Use get_image on the chosen image UUID for file URLs and attribution.

Cladograms from Newick:
- parse_newick for hierarchy only (no layout from MCP).
- pick_image per node (or label); you write the SVG. image: null → no <image> element (label only); do not subtaxon-retry.
- Typical vs default illustration is your strategy (which node UUID to pass to pick_image), not an MCP mode.
- Read phylopic://docs/cladogram-guide (and optional phylopic://docs/cladogram-template.svg) for layout and taxonomy pitfalls; file also at apps/mcp/docs/cladogram-for-agents.md.

If PhyloPic has no match, search_nodes external hits (GBIF, Open Tree of Life, PBDB) include resolved PhyloPic nodes when possible; otherwise use resolve_external_ids per list_namespaces and https://www.phylopic.org/articles/api-recipes .`

export const SEARCH_NODES_QUERY_HINT =
    "Pass the user's wording verbatim (common or scientific). Do not substitute Latin names or taxa from memory—call this tool first and use returned UUIDs."
