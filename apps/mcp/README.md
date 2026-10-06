# @phylopic/mcp

Local [Model Context Protocol](https://modelcontextprotocol.io) server for the public [PhyloPic API](https://api.phylopic.org).

Cladogram layout and collection SVG rendering live in [`@phylopic/diagrams`](../../packages/diagrams); this app re-exports those modules and adds MCP-specific resolution, `pick_image`, and server tools.

## Development

```bash
yarn workspace @phylopic/mcp build
yarn workspace @phylopic/mcp dev
```

The HTTP server listens on `http://127.0.0.1:3004/mcp` by default. Override with `PORT`.

Point at a local API while developing:

```bash
PHYLOPIC_API_URL=http://127.0.0.1:3003 yarn workspace @phylopic/mcp start
```

## Streamable HTTP

Start the server, then point your MCP client at the endpoint (exact config file location depends on the client):

```json
{
    "mcpServers": {
        "phylopic": {
            "url": "http://127.0.0.1:3004/mcp"
        }
    }
}
```

## Stdio (Claude Desktop and similar)

```json
{
    "mcpServers": {
        "phylopic": {
            "command": "node",
            "args": ["/absolute/path/to/phylopic/apps/mcp/dist/stdio.js"]
        }
    }
}
```

## Agent guidance

MCP clients that support **server instructions** receive workflow rules at connect time (see `src/agentInstructions.ts`): use `search_nodes` with the **user's exact words** first, never substitute taxa from model memory, and only use node UUIDs returned by the tools. By default, pick the **first** `find_images` result on the clade (PhyloPic sort order); users may override that by asking for a **typical**, **iconic**, or **representative** silhouette.

The registered prompt **`illustrate_taxon`** repeats the same workflow for clients that expose MCP prompts.

## Tools

Most tools are read-only wrappers around API endpoints: `search_nodes`, `get_node`, `get_root_node`, `get_lineage`, `find_images`, `get_image`, `resolve_external_id`, `resolve_external_ids`, `get_contributor`, `list_contributor_images`, `get_collection`, `list_licenses`, and `list_namespaces`.

**Collections and attribution:** `describe_image_set_usage`, `format_diagram_publication` (license footer + SVG metadata for diagrams), `create_collection`, and `create_collection_permalink` (optional `PHYLOPIC_WWW_URL` for www).

Cladogram helpers: **`parse_newick`** (Newick via [`newick-js`](https://www.npmjs.com/package/newick-js)), **`build_tree_from_terminals`** (lineage-inferred hierarchy from tip names), **`build_tree_from_collection`** (collection UUID or permalink → same tree plus fixed `imageUuidByTreeId`), and **`pick_image`** (primary when node-accurate, else first `filter_clade` on page 0). Unlabeled internal nodes: **`descendant_node_uuids`** (lineages → MRCA → pick). Browse alternates with **`find_images`** (`filter_clade`, 0-based `page`), then **`pick_image`** with **`clade_index`** / **`clade_page`** or **`image_uuid`**. The agent lays out and writes SVG; prompt **`cladogram_from_newick`** describes the workflow.

**Agent cladograms:** [`docs/cladogram-for-agents.md`](docs/cladogram-for-agents.md) (workflow), [`docs/cladogram-styles.md`](docs/cladogram-styles.md) (style catalog + **basic rectangular cladogram** layout rules). MCP resources: `phylopic://docs/cladogram-guide`, `phylopic://docs/cladogram-styles`, `phylopic://docs/cladogram-template.svg`. Reference layout: `src/cladogram/basicCladogramLayout.ts`.

See the [API Recipes](https://www.phylopic.org/articles/api-recipes) article for external hierarchy resolution with `resolve_external_ids`.

For taxon silhouettes, prefer `search_nodes` → use `phylopic.exactMatch` or a node whose title exactly matches the query → `find_images` with `filter_clade` (node UUID). **`filter_clade` includes images on subtaxa** (descendants), so an empty list or `pick_image` null is not fixed by querying a narrower subtaxon. By default, `search_nodes` also queries GBIF, Open Tree of Life, and the Paleobiology Database and resolves hits to PhyloPic nodes (see [API Recipes](https://www.phylopic.org/articles/api-recipes)). Set `include_external: false` for PhyloPic-only search. List `page` is **0-based** (`0` = first page). Use `filter_license_nc=false` to exclude NonCommercial licenses. Use `filter_license_sa=false` to exclude ShareAlike licenses. Use `filter_license_by=false` to exclude everything but public domain licenses.

