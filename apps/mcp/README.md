# @phylopic/mcp

Local [Model Context Protocol](https://modelcontextprotocol.io) server for the public [PhyloPic API](https://api.phylopic.org).

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

MCP clients that support **server instructions** receive workflow rules at connect time (see `src/agentInstructions.ts`): use `search_nodes` with the **user's exact words** first, never substitute taxa from model memory, and only use node UUIDs returned by the tools.

The registered prompt **`illustrate_taxon`** repeats the same workflow for clients that expose MCP prompts.

## Tools

Read-only tools wrap API endpoints: `search_nodes`, `get_node`, `get_root_node`, `get_lineage`, `find_images`, `get_image`, `resolve_external_id`, `resolve_external_ids`, `get_contributor`, `list_contributor_images`, `get_collection`, `list_licenses`, and `list_namespaces`.

See the [API Recipes](https://www.phylopic.org/articles/api-recipes) article for external hierarchy resolution with `resolve_external_ids`.

For taxon silhouettes, prefer `search_nodes` → `find_images` with `filter_clade` (node UUID). By default, `search_nodes` also queries GBIF, Open Tree of Life, and the Paleobiology Database and resolves hits to PhyloPic nodes (see [API Recipes](https://www.phylopic.org/articles/api-recipes)). Set `include_external: false` for PhyloPic-only search. List `page` is **0-based** (`0` = first page). Use `filter_license_nc=false` to exclude NonCommercial licenses. Use `filter_license_sa=false` to exclude ShareAlike licenses. Use `filter_license_by=false` to exclude everything but public domain licenses.

