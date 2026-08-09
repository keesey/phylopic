# _PhyloPic_ API Implementation

This is the implementation of the API (Application Programming Interface) for [_PhyloPic_](https://www.phylopic.org. The documentation for using this API is here: http://api-docs.phylopic.org

This implementation uses:

- [Amazon API Gateway HTTP API (v2)](https://aws.amazon.com/api-gateway/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [Serverless](https://www.serverless.com/)
- [Node.js](https://nodejs.org/)

Most methods retrieve data from a Postgres database. The structure of that database is detailed here: [create.sql](../../sql/create.sql)

The API is hosted at [https://api.phylopic.org](https://api.phylopic.org).

## Getting started

See instructions in the [_PhyloPic_ project `README`](../../README.md) for setting up the monorepo project.

### Environment variables

This app has no `.env` file. Values are injected per-Lambda at deploy time by
[`serverless.yml`](./serverless.yml), each one read from AWS Systems Manager Parameter Store
with `${ssm:NAME}`.

Variables are scoped to individual functions rather than the whole service, so the table below
names the functions that receive each one. That scoping is deliberate — see
[Notes](#notes).

#### Required

| Variable                   | Function(s)         | Purpose                                                    | How it is read   |
| -------------------------- | ------------------- | ---------------------------------------------------------- | ---------------- |
| `AUTH_SECRET_KEY`          | `auth`              | HMAC key for verifying contributor JWTs                    | `process.env`    |
| `PGDATABASE`               | `dynamic`           | Postgres database name (`phylopic-entities`)               | `pg`, implicitly |
| `PGHOST`                   | `dynamic`           | Postgres host                                              | `pg`, implicitly |
| `PGPASSWORD`               | `dynamic`           | Postgres password                                          | `pg`, implicitly |
| `PGUSER`                   | `dynamic`           | Postgres login role (`phylopic_api`)                       | `pg`, implicitly |
| `PHYLOPIC_BUILD`           | `static`, `dynamic` | Number of the current build, used for cache keys and paths | `process.env`    |
| `PHYLOPIC_BUILD_TIMESTAMP` | `static`            | Timestamp of the current build                             | `process.env`    |
| `PHYLOPIC_ROOT_UUID`       | `static`            | UUID of the root phylogenetic node                         | `process.env`    |

#### Optional

| Variable             | Function(s) | Purpose                                                                         | How it is read   |
| -------------------- | ----------- | ------------------------------------------------------------------------------- | ---------------- |
| `ENTITIES_BUCKET`    | `dynamic`   | S3 bucket for entity JSON (`entities.phylopic.org`)                             | `process.env`    |
| `ENTITY_JSON_SOURCE` | `dynamic`   | Entity JSON backend: `s3`, `postgres`, or `s3-fallback` (try S3, then Postgres) | `process.env`    |
| `PGPORT`             | `dynamic`   | Postgres port (default `5432`)                                                  | `pg`, implicitly |
| `IS_OFFLINE`         | all         | `"true"` under `serverless-offline`; prefixes redirects `/prod`                 | `process.env`    |

#### Set automatically

| Variable                                                                        | Purpose                                             | How it is read                                         |
| ------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`, `AWS_REGION` | S3 access for `POST /uploads` and entity JSON reads | Injected by the Lambda runtime from the execution role |

#### Notes

**Per-function scoping is a security boundary, not an accident.** `AUTH_SECRET_KEY` is present
only in the `auth` function, which is the sole place a token signature is checked. The
`uploader` function has no environment of its own; it takes the caller's identity from
`event.requestContext.authorizer.uuid`, populated by the authorizer, so it never needs the
signing key. Adding the key to another function would widen that boundary.

**The `PG*` variables are read implicitly.** `PG_CLIENT_SERVICE` constructs
`new Client({ connectionTimeoutMillis: 10000 })` with no connection parameters, so `pg` falls
back to its own environment lookup for host, port, user, password, and database. Nothing in this
app references `process.env.PGHOST` and friends, which means they will not appear in a search of
the source.

**No AWS keys are required.** The service assumes `role/phylopic-api-executor`
(`provider.iam.role`), and the runtime supplies short-lived credentials from that role through
the `AWS_*` variables above. Do not set static AWS keys here.

**`useDotenv: true`** means Serverless will load a `.env` file from this directory at deploy time
for any `${env:...}` reference. None are currently used; all deploy-time values come from SSM.

## Linting

To clean up formatting for source files:

```sh
yarn lint
```

## Running locally

To run the API on your local machine, on port `3003`:

```sh
yarn dev
```

## Deploying

To deploy to `api.phylopic.org` (if you have [AWS Command Line Interface](https://aws.amazon.com/cli/) set up with proper credentials):

```sh
yarn deploy
```

## Authors

- **T. Michael Keesey** - [keesey](https://github.com/keesey)

## License

This project is licensed under the [MIT License](../../LICENSE).
