# _PhyloPic_ Contribution Webapp

This [Next.js](https://nextjs.org/) application allows users to upload silhouette images to [_PhyloPic_](https://beta/phylopic.org).

The app is hosted at [https://contribute.phylopic.org](https://contribute.phylopic.org).

## Getting started

See instructions in the [_PhyloPic_ project `README`](../../README.md) for setting up the monorepo project. You will also need to install and configure [AWS Command Line Interface](https://aws.amazon.com/cli/).

### Environment Variables

The following environment variables are required. They may be stored in `.env.local` in the root of this project.

| Variable Name            | Description                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| `AUTH_SECRET_KEY`        | Secret key used for authentication                                   |
| `MAILGUN_API_KEY`        | API key for [Mailgun](https://www.mailgun.com/)                      |
| `MAILGUN_DOMAIN`         | Domain for [Mailgun](https://www.mailgun.com/) (`mail.phylopic.org`) |
| `NEXT_PUBLIC_API_URL`    | _PhyloPic_ API URL (`https://api.phylopic.org`)                      |
| `NEXT_PUBLIC_WWW_DOMAIN` | Domain of the main _PhyloPic_ website (`beta.phylopic.org`)          |

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

To run a development version on your local machine, on port `3002`:

```sh
yarn dev
```

The run the production version locally, on port `3000`:

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

-   **T. Michael Keesey** - [keesey](https://github.com/keesey)

## License

This project is licensed under the [MIT License](../../LICENSE).
