# _PhyloPic_ Webapp

This [Next.js](https://nextjs.org/) application allows users to find and download freely reusable silhouette images of organisms.

The app is hosted at [https://www.phylopic.org](https://www.phylopic.org) and will eventually move to `https://www.phylopic.org`.

## Getting started

See instructions in the [_PhyloPic_ project `README`](../../README.md) for setting up the monorepo project.

### Environment Variables

The following environment variables are required. They may be stored in `.env.local` in the root of this project.

| Variable Name                          | Description                                                                                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL`                  | Root URL of the _PhyloPic_ API (`https://api.phylopic.org`)                                                                                                        |
| `NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID` | UUID for the contributing user that is also the site's contact point (`060f03a9-fafd-4d08-81d1-b8f82080573f`)                                                      |
| `NEXT_PUBLIC_CONTRIBUTE_URL`           | Root URL of the _PhyloPic: Contribute_ website (`https://contribute.phylopic.org`)                                                                                 |
| `NEXT_PUBLIC_ROOT_UUID`                | ID for the root phylogenetic node (`8f901db5-84c1-4dc0-93ba-2300eeddf4ab`)                                                                                         |
| `NEXT_PUBLIC_WWW_URL`                  | Root URL of the main _PhyloPic_ website (`https://www.phylopic.org`)                                                                                               |
| `REVALIDATE_TOKEN`                     | Secret key for [Next.js on-demand revalidation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#using-on-demand-revalidation) |

The following environment variables are optional:

| Variable Name                       | Description                                     |
| ----------------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_EOL_API_KEY`           | [Encyclopedia of Life](https://eol.org) API key |
| `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` | Measurement ID for Google Analytics             |

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

The run the production version locally, on port `3000`:

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

-   **T. Michael Keesey** - [keesey](https://github.com/keesey)

## License

This project is licensed under the [MIT License](../../LICENSE).
