# `@phylopic/ui`

User interface code for _PhyloPic_ websites.

## Environment variables

This package has no environment file of its own. It is compiled as part of whichever app imports
it, so these variables must be set **in the consuming app**, not here. Every one is prefixed
`NEXT_PUBLIC_`, which means Next.js substitutes its value into the browser bundle at build time.

### Required

Required by the components that use them; unused components do not need them set.

| Variable                 | Purpose                                                         | How it is read                              |
| ------------------------ | --------------------------------------------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_API_URL`    | Root URL of the _PhyloPic_ API, called by the search components | `process.env`, inlined into the bundle      |
| `NEXT_PUBLIC_VERCEL_ENV` | Analytics events are only sent when this is `production`        | Provided by Vercel; inlined into the bundle |

### Optional

| Variable                  | Purpose                                                                   | How it is read                         |
| ------------------------- | ------------------------------------------------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_EOL_API_KEY` | [Encyclopedia of Life](https://eol.org) API key for the EOL search source | `process.env`, inlined into the bundle |

### Notes

**None of these can hold a secret.** Because they are inlined into client JavaScript, their values
are readable by anyone who loads a page. `NEXT_PUBLIC_EOL_API_KEY` is a third-party key, so the
consequence is quota abuse rather than compromise, but it should ideally move behind a server-side
proxy — `apps/www/pages/api/suggestions` already does exactly that for the same API and is the
pattern to follow.

**`NEXT_PUBLIC_VERCEL_ENV` will be absent outside Vercel,** which means analytics are silently
disabled in local development. That is the intended behaviour, not a misconfiguration.

Consuming apps: see [`apps/www`](../../apps/www/README.md#environment-variables) and
[`apps/contribute`](../../apps/contribute/README.md#environment-variables).
