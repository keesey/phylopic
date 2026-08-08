# _PhyloPic_ Editing Webapp

This [Next.js](https://nextjs.org/) application allows users to manage data for [_PhyloPic_](https://www.phylopic.org), including phylogenetic nodes and silhouette images. It includes the interface for reviewing images uploaded via the [Contribute webapp](../contribute).

This app is only meant to be run locally. It is not hosted online.

## Getting started

See instructions in the [_PhyloPic_ project `README`](../../README.md) for setting up the monorepo project.

### Environment variables

These live in `.env.local` in the root of this project. This app is local-only: it has no `build`
or `start` script, and its dev server binds to `127.0.0.1`, so there is no deployed environment
to configure.

#### Required

| Variable               | Purpose                                             | How it is read                         |
| ---------------------- | --------------------------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | Root URL of the _PhyloPic_ API                      | `process.env`, inlined into the bundle |
| `PGHOST`               | Postgres host for `phylopic-source`                 | `pg`, implicitly                       |
| `PGPASSWORD`           | Postgres password                                   | `pg`, implicitly                       |
| `PGUSER`               | Postgres login role (`phylopic_source`)             | `pg`, implicitly                       |
| `S3_ACCESS_KEY_ID`     | Access key for the uploads and source-image buckets | `process.env`, server-side only        |
| `S3_REGION`            | Region of those buckets                             | `process.env`, server-side only        |
| `S3_SECRET_ACCESS_KEY` | Secret key for those buckets                        | `process.env`, server-side only        |

#### Optional

| Variable | Purpose                        | How it is read   |
| -------- | ------------------------------ | ---------------- |
| `PGPORT` | Postgres port (default `5432`) | `pg`, implicitly |

#### Notes

**The `PG*` variables are read implicitly.** `src/source/SourceClient.ts` constructs
`new Pool({ database: "phylopic-source" })`, supplying only the database name, so `pg` resolves
host, port, user, and password from the environment itself. They therefore never appear as
`process.env.PGHOST` in this codebase. Setting `PGDATABASE` has no effect here, because the
explicit `database` option takes precedence over it.

**There is no `AUTH_SECRET_KEY`, because this app has no authentication.** None of its API routes
verify a caller, and several of them mutate state — publishing submissions, merging taxonomy
nodes. What keeps that safe is that the app is never deployed and never listens beyond localhost.
If it is ever given a `build` or `start` script, it needs authentication on every mutating route
first, and this section will need an entry for whatever that mechanism uses.

**Which S3 principal to use** is documented in [`aws/`](../../aws/README.md). This app needs the
broadest storage access of the web apps, because it performs the cross-bucket copy that accepts a
submission into the source-image corpus.

## Linting

To clean up formatting for source files:

```sh
yarn lint
```

## Running

To run on your local machine, on port `3001`:

```sh
yarn dev
```

## Authors

- **T. Michael Keesey** - [keesey](https://github.com/keesey)

## License

This project is licensed under the [MIT License](../../LICENSE).
