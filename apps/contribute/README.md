# _PhyloPic_ Contribution Webapp

This [Next.js](https://nextjs.org/) application allows users to upload silhouette images to [_PhyloPic_](https://www.phylopic.org).

The app is hosted at [https://contribute.phylopic.org](https://contribute.phylopic.org).

## Getting started

See instructions in the [_PhyloPic_ project `README`](../../README.md) for setting up the monorepo project.

### Environment variables

Locally these live in `.env.local` in the root of this project. In deployment they are Vercel
project environment variables.

#### Required

| Variable                     | Purpose                                                   | How it is read                         |
| ---------------------------- | --------------------------------------------------------- | -------------------------------------- |
| `AUTH_SECRET_KEY`            | HMAC key for signing and verifying contributor JWTs       | `process.env`, server-side only        |
| `NEXT_PUBLIC_API_URL`        | Root URL of the _PhyloPic_ API                            | `process.env`, inlined into the bundle |
| `NEXT_PUBLIC_CONTRIBUTE_URL` | Root URL of this site; also used to build magic-link URLs | `process.env`, inlined into the bundle |
| `NEXT_PUBLIC_UPLOADS_URL`    | Root URL from which uploaded submission files are served  | `process.env`, inlined into the bundle |
| `NEXT_PUBLIC_WWW_URL`        | Root URL of the main _PhyloPic_ website                   | `process.env`, inlined into the bundle |
| `PGHOST`                     | Postgres host for `phylopic-source`                       | `pg`, implicitly                       |
| `PGPASSWORD`                 | Postgres password                                         | `pg`, implicitly                       |
| `PGUSER`                     | Postgres login role (`phylopic_source`)                   | `pg`, implicitly                       |
| `S3_ACCESS_KEY_ID`           | Access key for S3 buckets (local dev)                     | `process.env`, server-side only        |
| `S3_REGION`                  | Region of those buckets                                   | `process.env`, server-side only        |
| `S3_SECRET_ACCESS_KEY`       | Secret key for S3 buckets (local dev)                     | `process.env`, server-side only        |
| `SES_ACCESS_KEY_ID`          | Access key for magic-link email (local dev)               | `process.env`, server-side only        |
| `SES_REGION`                 | Region of the verified SES identity                       | `process.env`, server-side only        |
| `SES_SECRET_ACCESS_KEY`      | Secret key for magic-link email (local dev)               | `process.env`, server-side only        |
| `AWS_ROLE_ARN`               | IAM role for Vercel OIDC (covers S3 + SES on deploy)      | `process.env`, server-side only        |

#### Optional

| Variable                            | Purpose                         | How it is read                         |
| ----------------------------------- | ------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` | Google Analytics measurement ID | `process.env`, inlined into the bundle |
| `PGPORT`                            | Postgres port (default `5432`)  | `pg`, implicitly                       |

#### Set automatically

| Variable                 | Purpose                                                         | How it is read     |
| ------------------------ | --------------------------------------------------------------- | ------------------ |
| `NEXT_PUBLIC_VERCEL_ENV` | Gates analytics events to `production` (used in `@phylopic/ui`) | Provided by Vercel |

#### Notes

**The `PG*` variables are read implicitly.** `src/source/SourceClient.ts` constructs
`new Pool({ database: "phylopic-source" })`, supplying only the database name, so `pg` resolves
host, port, user, and password from the environment itself. They therefore never appear as
`process.env.PGHOST` in this codebase. Setting `PGDATABASE` has no effect here, because the
explicit `database` option takes precedence over it.

**`SES_*` and `S3_*` are two different credentials.** See
[`aws/`](../../aws/README.md) for which one belongs where and what it may do.

**Rotating `AUTH_SECRET_KEY` invalidates every outstanding session.** Tokens are held in
`localStorage`, so clients discover this as a `401` on their next authorized request and clear
the stored token then.

**Anything prefixed `NEXT_PUBLIC_` is not a secret.** Next.js substitutes these into the
JavaScript sent to browsers at build time, so their values are public regardless of how they are
marked in Vercel.

## Linting

To clean up formatting for source files:

```sh
yarn lint
```

## Running locally

To run a development version on your local machine, on port `3002`:

```sh
yarn dev
```

To run the production version locally, on port `3000`:

```sh
yarn build && yarn start
```

## Deploying

To deploy to `contribute.phylopic.org`, use [Git](https://git-scm.com/) to set the `@phylopic/contribute/prod` branch to the desired commit, then push to `origin`.

```sh
git push origin @phylopic/contribute/prod
```

The app will deploy through [Vercel](https://vercel.com/keesey/phylopic-contribute).

## Authors

- **T. Michael Keesey** - [keesey](https://github.com/keesey)

## License

This project is licensed under the [MIT License](../../LICENSE).
