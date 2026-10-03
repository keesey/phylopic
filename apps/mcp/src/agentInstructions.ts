/** Shown to MCP clients at initialize; keep in sync with tool descriptions and README. */
export const MCP_AGENT_INSTRUCTIONS = `PhyloPic taxon and silhouette workflow:

1. Do not infer scientific names, family names, or node UUIDs from general knowledge. PhyloPic's tree and vernacular names may differ from other sources.
2. Always start with search_nodes using the user's exact words (common or scientific), e.g. query "ants" not "Formicidae" unless the user said Formicidae.
3. Pick a node UUID only from search_nodes results (phylopic.results or external[].phylopic). Use get_node to confirm before find_images.
4. Prefer the broadest PhyloPic node that fits the user's intent when multiple matches exist (e.g. a clade rather than a single species when they asked for a group).
5. Use find_images with filter_clade set to that UUID; list page is 0-based (page=0 is first). Apply license filters as needed.
6. Use get_image on the chosen image UUID for file URLs and attribution.

If PhyloPic has no match, search_nodes external hits (GBIF, Open Tree of Life, PBDB) include resolved PhyloPic nodes when possible; otherwise use resolve_external_ids per list_namespaces and https://www.phylopic.org/articles/api-recipes .`

export const SEARCH_NODES_QUERY_HINT =
    "Pass the user's wording verbatim (common or scientific). Do not substitute Latin names or taxa from memory—call this tool first and use returned UUIDs."
