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

## Cursor

Start the server, then add to `.cursor/mcp.json`:

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

## Tools

Read-only tools wrap API endpoints: `search_nodes`, `get_node`, `get_root_node`, `get_lineage`, `find_images`, `get_image`, `resolve_external_id`, `resolve_external_ids`, `get_contributor`, `list_contributor_images`, `get_collection`, `list_licenses`, and `list_namespaces`.

See the [API Recipes](https://www.phylopic.org/articles/api-recipes) article for external hierarchy resolution with `resolve_external_ids`.

For taxon silhouettes, prefer `search_nodes` → `find_images` with `filter_clade` (node UUID). List `page` is **0-based** (`0` = first page). Use `filter_license_nc=false` to exclude NonCommercial licenses.
