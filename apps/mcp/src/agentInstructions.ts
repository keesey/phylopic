/** Shown to MCP clients at initialize; keep in sync with tool descriptions and README. */
export const MCP_AGENT_INSTRUCTIONS = `PhyloPic node and image workflow:

1. Do not infer scientific names, family names, or node UUIDs from general knowledge. PhyloPic's tree and vernacular names may differ from other sources.
2. Always start with search_nodes using the user's exact words (common or scientific), e.g. query "ants" not "Formicidae" unless the user said Formicidae.
3. Pick a node UUID from search_nodes: prefer phylopic.exactMatch or any node whose title exactly matches the query (case-insensitive). Do not substitute a related name (e.g. Homo (sapiens) when the user or Newick label said Homo sapiens). Use external[].phylopic only when PhyloPic name search has no exact title match. Use get_node to confirm before find_images.
4. Prefer the broadest PhyloPic node that fits the user's intent when multiple matches exist (e.g. a clade rather than a single species when they asked for a group).
5. Use find_images with filter_clade set to that UUID. filter_clade includes images tagged on that node and on any subtaxon (descendants)—not only exact matches. List page is 0-based (page=0 is first). Apply license filters only when the user asks.
6. Default: when the user does not specify a particular species or image, choose the first image on page 0 of that clade list. PhyloPic sorts clade images by phylogenetic proximity to the node (ancestral/default), matching the order on the node silhouettes page.
7. Override: if the user asks for a "typical", "iconic", "representative", or similar image, choose a narrower node via search_nodes first, then pick_image or find_images on that UUID—do not invent UUIDs from memory. That narrower UUID is a deliberate illustration choice, not a way to recover from null.
8. pick_image default: primaryImage when its specificNode matches, else first filter_clade hit on page 0, else no image. To use another silhouette on the same node, find_images (filter_clade) then pick_image with clade_index/clade_page or image_uuid.
9. When pick_image or find_images returns no image for a node, do not retry with a narrower subtaxon name or UUID to fill the gap—filter_clade on that node already searched subtaxa. Omit the silhouette (label-only in cladograms), tell the user, or relax license filters only if they allow; do not substitute a parent/ancestor silhouette unless the user asks for that policy.
10. Use get_image on the chosen image UUID for file URLs and attribution.

Collections and permalinks (multi-image work):
- describe_image_set_usage on all image UUIDs used (e.g. cladogram silhouettes) for combined license URL and attribution text.
- create_collection with the same UUIDs, then create_collection_permalink when attribution is required on published diagrams. Cite the permalink URL in the footer—not the collection page (www API; rate-limited).

Cladograms from Newick:
- parse_newick for hierarchy from Newick, build_tree_from_terminals for tip names, or build_tree_from_collection for a collection UUID or permalink (uses each collection image’s specific node as a tip; imageUuidByTreeId fixes silhouettes). No layout from MCP. Use each node’s label exactly as returned; Newick sibling order is left-to-right; build_tree_from_terminals orders branches by terminal count (smallest first), then alphabetically.
- pick_image: terminals use default filter_clade fallback. Ancestral/internal nodes: image_list ancestral (filter_node on this node, then each PhyloPic ancestor; never use exclude_node_uuids, especially the cladogram parent's PhyloPic UUID). Unlabeled internal: descendant_node_uuids → MRCA + ancestral pick. Link silhouettes to the chosen image.
- image: null → no <image> element (label-only where a label exists); do not subtaxon-retry.
- Typical vs default illustration is your strategy (which node UUID to pass to pick_image), not an MCP mode.
- Read phylopic://docs/cladogram-guide for workflow and phylopic://docs/cladogram-styles for layout (basic rectangular cladogram; measured label/image sizes, not character estimates). Optional phylopic://docs/cladogram-template.svg.
- Link labels to https://www.phylopic.org/nodes/{nodeUuid} and silhouettes to https://www.phylopic.org/images/{imageUuid} in SVG <a> elements.
- Every published diagram must include license and required attribution for its silhouettes. Call format_diagram_publication (or describe_image_set_usage then build footer yourself): license defaults to combinedLicenseUrl (user may choose a more restrictive license only); attribution is null when not required; on published diagrams use a permalink ("For attribution, see …") after create_collection_permalink, not full_text or collection URLs. Render license at the bottom: "This image is available under the … license." with LICENSE_NAMES link text (Roboto, not Georgia). Include metadataXml (license, attribution, PhyloPic image source links, generator PhyloPic.org) and expand viewBox for the footer.

If PhyloPic has no match, search_nodes external hits (GBIF, Open Tree of Life, PBDB) include resolved PhyloPic nodes when possible; otherwise use resolve_external_ids per list_namespaces and https://www.phylopic.org/articles/api-recipes .`

export const SEARCH_NODES_QUERY_HINT =
    "Pass the user's wording verbatim (common or scientific). Do not substitute Latin names or taxa from memory—call this tool first and use returned UUIDs."
