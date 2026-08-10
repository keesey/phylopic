# PhyloPic: Publisher

Publishing scripts for _[PhyloPic](https://www.phylopic.org)_ builds.

## Setting up

See instructions in the [_PhyloPic_ project `README`](../../README.md) for setting up the monorepo project.

### Prerequisites

Make sure you have the following installed on your system and reachable via the system path:

- [AWS CLI](https://aws.amazon.com/cli/) (v2.4.20 or higher)
- [Image Magick](https://imagemagick.org/script/download.php) (v7.1 or higher)
- [Inkscape](https://inkscape.org/release/inkscape-1.1.2/) (v1.1 or higher)
- [Node.js](https://nodejs.org/en/download/) (v24 or higher)
- [potrace](http://potrace.sourceforge.net/#downloading) (v1.16 or higher)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) (v1.22 or higher)

### Environment variables

These live in `.env` in the root of this project, loaded by `import "dotenv/config"` at the top of
each entry script (`insert.ts`, `release.ts`, `revalidate.ts`, `autolink.ts`, `normalize.ts`,
`coverage.ts`).

This project uses **one operator credential** for all AWS calls in `yarn make`: set
`AWS_PROFILE=phylopic-publish` (see [`aws/README.md`](../../aws/README.md)). The SDK clients
and `aws s3 sync` scripts all use the default credential chain.

Legacy: `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, and `S3_REGION` in `.env` still work for
`SourceClient` if set; omit them when using `AWS_PROFILE` only.

#### Required

| Variable                         | Purpose                                                                   | How it is read |
| -------------------------------- | ------------------------------------------------------------------------- | -------------- |
| `API_CLOUDFRONT_DISTRIBUTION_ID` | Distribution to invalidate after a build, so the API serves fresh data    | `process.env`  |
| `ENTITIES_BUCKET`                | S3 bucket for entity JSON (`entities.phylopic.org`; default if unset)     | `process.env`  |
| `PGHOST`                         | Postgres host                                                             | `process.env`  |
| `PGPASSWORD`                     | Postgres password                                                         | `process.env`  |
| `PGUSER`                         | Postgres login role (`phylopic_publish`)                                  | `process.env`  |
| `REVALIDATE_TOKEN`               | Shared secret sent as `Authorization: Bearer …` on `POST /api/revalidate` | `process.env`  |
| `WWW_URL`                        | Root URL of the main website, called to trigger revalidation              | `process.env`  |

#### Optional (legacy S3 keys)

| Variable               | Purpose                                                          | How it is read |
| ---------------------- | ---------------------------------------------------------------- | -------------- |
| `S3_ACCESS_KEY_ID`     | Explicit keys for `@phylopic/source-client` (else `AWS_PROFILE`) | `process.env`  |
| `S3_SECRET_ACCESS_KEY` | Same                                                             | `process.env`  |
| `S3_REGION`            | Region for that client (else `AWS_REGION`)                       | `process.env`  |

#### Optional

| Variable       | Purpose                                                 | How it is read |
| -------------- | ------------------------------------------------------- | -------------- |
| `EOL_API_KEY`  | [Encyclopedia of Life](https://eol.org) API key         | `process.env`  |
| `NCBI_API_KEY` | NCBI API key, for higher rate limits during autolinking | `process.env`  |
| `PGPORT`       | Postgres port (default `5432`)                          | `process.env`  |

#### Resolved from the AWS credential chain (required for `yarn make`)

These are read by the AWS CLI and SDK clients. Configure the **`phylopic-publish`** profile
in `~/.aws/credentials` — see [`aws/README.md`](../../aws/README.md).

| Variable                                                          | Used by                                                                        | Purpose                          |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------- |
| `AWS_PROFILE`                                                     | `aws s3 sync`, SSM, Lambda, CloudFront, and `SourceClient` when `S3_*` omitted | Selects `phylopic-publish`       |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` | the same                                                                       | Credentials, if not from profile |
| `AWS_REGION`, `AWS_DEFAULT_REGION`                                | the same                                                                       | Region (`us-west-2`)             |

#### Notes

**Use `AWS_PROFILE=phylopic-publish`, not the administrator profile.** The scoped IAM user
[`phylopic-publish`](../../aws/policies/phylopic-publish.json) replaces `AdministratorAccess`
for the release pipeline. `Lambda UpdateFunctionConfiguration` on the two API functions remains
the highest-risk grant in that policy; it is operator-only, same as before, but no longer
account-wide.

**`PG*` here is explicit, unlike in `contribute` and `edit`.** `src/source/SourceClient.ts` passes
host, port, user, and password to `ClientProvider` directly, and hardcodes the database name, so
`PGDATABASE` is not consulted.

## Running scripts

### Release a new build

This will build and release a new build of the website, created from the files in the `source-images.phylopic.org` bucket and data in the `phylopic-source` database.

```sh
yarn make
```

### Verify entity JSON on S3

After `yarn insert`, spot-check that Postgres `json` columns match S3 objects for a build:

```sh
yarn verify:entities 547
```

Optional: set `VERIFY_SAMPLE_SIZE` (default `20`) to control how many random entities per table are checked.

### Autolink externals

These commands will pull data from external APIs and try to match them to nodes in the `phylopic-source` database.

```sh
yarn autolink eol
yarn autolink gbif
yarn autolink otol
yarn autolink pbdb
```

### Normalize names

Node names should be normalized already, but to ensure nothing got missed, they can all be normalized by running:

```sh
yarn normalize
```

### Report silhouette coverage

This command will report coverage statistics for nodes (number of silhouettes per number of terminal nodes, as reported by the _[Open Tree of Life](https://opentreeoflife.github.io/)_).

```sh
yarn coverage <UUID> <UUID> ...
```
