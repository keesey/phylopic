# _PhyloPic_ SQL Scripts

This folder includes scripts for creating the two databases used by _PhyloPic_:

- [`phylopic-entities`](./phylopic-entities.sql): database used by the [public API](../apps/api/README.md), optimized for speed.
- [`phylopic-source`](./phylopic-source.sql): normalized system of record used as the basis for data builds.

It also includes [`roles.sql`](./roles.sql), which creates one least-privilege login role per consumer
(`phylopic_api`, `phylopic_source`, `phylopic_publish`) in place of a single shared credential. The public
API's role gets read access to `phylopic-entities` plus `INSERT` on `collection`, and nothing at all on
`phylopic-source`.
