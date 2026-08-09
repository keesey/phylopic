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

This project draws on **two** separate credentials, which is easy to miss: the `S3_*` variables
below, and whatever the AWS credential chain resolves for the parts that use it. See
[Notes](#notes).

#### Required

| Variable                         | Purpose                                                                | How it is read |
| -------------------------------- | ---------------------------------------------------------------------- | -------------- |
| `API_CLOUDFRONT_DISTRIBUTION_ID` | Distribution to invalidate after a build, so the API serves fresh data | `process.env`  |
| `ENTITIES_BUCKET`                | S3 bucket for entity JSON (`entities.phylopic.org`; default if unset)  | `process.env`  |
| `PGHOST`                         | Postgres host                                                          | `process.env`  |
| `PGPASSWORD`                     | Postgres password                                                      | `process.env`  |
| `PGUSER`                         | Postgres login role (`phylopic_publish`)                               | `process.env`  |
| `S3_ACCESS_KEY_ID`               | Access key for listing source images through `@phylopic/source-client` | `process.env`  |
| `S3_REGION`                      | Region for that client                                                 | `process.env`  |
| `REVALIDATE_TOKEN`               | Shared secret sent to `apps/www`'s `/api/revalidate`                   | `process.env`  |
| `S3_SECRET_ACCESS_KEY`           | Secret key for that client                                             | `process.env`  |
| `WWW_URL`                        | Root URL of the main website, called to trigger revalidation           | `process.env`  |

#### Optional

| Variable       | Purpose                                                 | How it is read |
| -------------- | ------------------------------------------------------- | -------------- |
| `EOL_API_KEY`  | [Encyclopedia of Life](https://eol.org) API key         | `process.env`  |
| `NCBI_API_KEY` | NCBI API key, for higher rate limits during autolinking | `process.env`  |
| `PGPORT`       | Postgres port (default `5432`)                          | `process.env`  |

#### Resolved from the AWS credential chain

These are never referenced in the source. They are read implicitly by the AWS CLI and by SDK
clients that are constructed with no explicit credentials, and are normally supplied by
`~/.aws/credentials` rather than by this project's `.env`.

| Variable                                                          | Used by                                                                    | Purpose                          |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------- |
| `AWS_PROFILE`                                                     | `aws s3 sync` in `download:*`, `upload:images`, `sync:images`              | Selects a named profile          |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` | the same scripts, plus `SSMClient`, `CloudFrontClient`, and `LambdaClient` | Credentials, if not from profile |
| `AWS_REGION`, `AWS_DEFAULT_REGION`                                | the same                                                                   | Region, if not from profile      |

#### Notes

**The second credential is a full administrator.** `aws s3 sync` and the SSM, CloudFront, and
Lambda clients are all constructed without explicit credentials, so they run as whatever profile
the operator has configured. Among those calls is Lambda `UpdateFunctionConfiguration` against
the API's functions, which can rewrite their environment — a permission no scoped application key
should hold, and the reason this pipeline is properly an operator tool rather than a service. The
consequence is that a `yarn make` runs with administrative authority; scoping that to a dedicated
profile is tracked in [`aws/`](../../aws/README.md) under "Known gaps."

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
