# _PhyloPic_ Webapp

This [Next.js](https://nextjs.org/) application allows users to find and download freely reusable silhouette images of organisms.

The app is hosted at [https://www.phylopic.org](https://www.phylopic.org) and will eventually move to `https://www.phylopic.org`.

## Getting started

See instructions in the [_PhyloPic_ project `README`](../../README.md) for setting up the monorepo project.

### Environment variables

Locally these live in `.env.local` in the root of this project. In deployment they are Vercel
project environment variables.

#### Required

| Variable                               | Purpose                                          | How it is read                         |
| -------------------------------------- | ------------------------------------------------ | -------------------------------------- |
| `AWS_ROLE_ARN`                         | IAM role for Vercel OIDC (production deploy)     | `process.env`, server-side only        |
| `KV_REST_API_URL`                      | Upstash Redis REST URL for fundraiser state           | `process.env`, server-side only        |
| `KV_REST_API_READ_ONLY_TOKEN`          | Read-only token for `GET /api/fundraiser`             | `process.env`, server-side only        |
| `KV_REST_API_TOKEN`                    | Read-write token for `POST /api/fundraiser/paypal`    | `process.env`, server-side only        |
| `NEXT_PUBLIC_API_URL`                  | Root URL of the _PhyloPic_ API                   | `process.env`, inlined into the bundle |
| `NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID` | Contributor who is also the site's contact point | `process.env`, inlined into the bundle |
| `NEXT_PUBLIC_CONTRIBUTE_URL`           | Root URL of _PhyloPic: Contribute_               | `process.env`, inlined into the bundle |
| `NEXT_PUBLIC_ROOT_UUID`                | UUID of the root phylogenetic node               | `process.env`, inlined into the bundle |
| `NEXT_PUBLIC_WWW_URL`                  | Root URL of this site                            | `process.env`, inlined into the bundle |
| `S3_ACCESS_KEY_ID`                     | Access key for the permalinks bucket (local dev) | `process.env`, server-side only        |
| `S3_REGION`                            | Region of the permalinks bucket                  | `process.env`, server-side only        |
| `S3_SECRET_ACCESS_KEY`                 | Secret key for the permalinks bucket (local dev) | `process.env`, server-side only        |

The `S3_*` trio is only needed for permalinks locally; on Vercel use `AWS_ROLE_ARN` instead
(see [`aws/README.md`](../../aws/README.md)). Everything else in the site runs without S3 access.
To get everything else up and running quickly, you can use these values in your `.env.local` file:

```sh
NEXT_PUBLIC_API_URL=https://api.phylopic.org
NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID=060f03a9-fafd-4d08-81d1-b8f82080573f
NEXT_PUBLIC_CONTRIBUTE_URL=https://contribute.phylopic.org
NEXT_PUBLIC_ROOT_UUID=8f901db5-84c1-4dc0-93ba-2300eeddf4ab
NEXT_PUBLIC_WWW_URL=https://www.phylopic.org
```

#### Optional

| Variable                            | Purpose                                                              | How it is read                         |
| ----------------------------------- | -------------------------------------------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_EOL_API_KEY`           | [Encyclopedia of Life](https://eol.org) API key                      | `process.env`, inlined into the bundle |
| `NEXT_PUBLIC_FUNDRAISER_PREVIEW`    | Set to `true` to show the fundraiser banner outside May/October      | `process.env`, inlined into the bundle |
| `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` | Google Analytics measurement ID                                      | `process.env`, inlined into the bundle |
| `REVALIDATE_TOKEN`                  | Shared secret for `POST /api/revalidate` (`Authorization: Bearer …`) | `process.env`, server-side only        |

Required for on-demand revalidation (including the call from `apps/publish`). If unset, that
endpoint rejects every request rather than failing open.

#### Set automatically

| Variable                 | Purpose                                                          | How it is read                         |
| ------------------------ | ---------------------------------------------------------------- | -------------------------------------- |
| `ANALYZE`                | `yarn analyze` sets this to `true` to enable the bundle analyzer | Set by the `analyze` script            |
| `NEXT_PUBLIC_VERCEL_ENV` | Gates analytics events to `production` (used in `@phylopic/ui`)  | Provided by Vercel                     |
| `VERCEL_OIDC_TOKEN`      | Short-lived OIDC token; written by `vercel env pull`             | Provided by Vercel; unused by our code |

#### Notes

**Anything prefixed `NEXT_PUBLIC_` is not a secret.** Next.js substitutes these into the
JavaScript sent to browsers at build time, so their values are public regardless of how they are
marked in Vercel. That applies to `NEXT_PUBLIC_EOL_API_KEY`: it is a third-party key visible to
anyone who reads the bundle, so the exposure is quota abuse. `pages/api/suggestions` already
proxies EOL server-side, which is the pattern to prefer.

**Which S3 principal to use** is documented in [`aws/`](../../aws/README.md). This app needs only
read and write on `permalinks.phylopic.org/data/*`.

**Fundraiser storage** uses the Vercel Marketplace Upstash integration (`upstash-kv-phylopic-fundraiser`).
Campaign totals are updated via PayPal IPN at `POST /api/fundraiser/paypal`. In the PayPal dashboard,
set the IPN notification URL to `https://www.phylopic.org/api/fundraiser/paypal`. Set campaign goals
from the local [`edit`](../edit) app (`FundraiserSection` on its home page).

## Linting

To clean up formatting for source files:

```sh
yarn lint
```

## Running locally

To run a development version on your local machine, on port `3000`:

```sh
yarn dev
```

Then run the production version locally, on port `3000`:

```sh
yarn build && yarn start
```

## Deploying

To deploy to `www.phylopic.org`, use [Git](https://git-scm.com/) to set the `@phylopic/www/prod` branch to the desired commit, then push to `origin`.

```sh
git push origin @phylopic/www/prod
```

The app will deploy through [Vercel](https://vercel.com/keesey/phylopic-www).

## Authors

- **T. Michael Keesey** - [keesey](https://github.com/keesey)

## License

This project is licensed under the [MIT License](../../LICENSE).
