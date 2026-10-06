# @phylopic/diagrams

Shared **basic rectangular cladogram** layout and **collection cladogram** SVG generation for `@phylopic/mcp` and `@phylopic/www`.

- Tree from collection images (specific-node tips + PhyloPic lineages)
- Rail/column layout (`basicCladogramLayout`)
- Browser-safe label measurement and client-side SVG download helpers

Consumers import **`dist/`** (not committed). After changing this package’s `src/`, rebuild:

```bash
yarn workspace @phylopic/diagrams build
```

Or from the repo root: `turbo run build --filter=@phylopic/diagrams`.

`yarn dev` in `@phylopic/www` runs that build first (`predev`). Root `turbo run dev` builds workspace dependencies via `dependsOn: ["^build"]`. For iterative work on diagrams, run `yarn dev` in this package (tsup watch) in a second terminal.
