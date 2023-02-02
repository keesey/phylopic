# _PhyloPic_ API Implementation

This is the implementation of the API (Application Programming Interface) for [_PhyloPic_](https://www.phylopic.org. The documentation for using this API is here: http://api-docs.phylopic.org

This implementation uses:

-   [Amazon API Gateway](https://aws.amazon.com/api-gateway/)
-   [AWS Lambda](https://aws.amazon.com/lambda/)
-   [Serverless](https://www.serverless.com/)
-   [Node.js](https://nodejs.org/)

Most methods retrieve data from a Postgres database. The structure of that database is detailed here: [create.sql](../../sql/create.sql)

The API is hosted at [https://api.phylopic.org](https://api.phylopic.org).

## Getting started

See instructions in the [_PhyloPic_ project `README`](../../README.md) for setting up the monorepo project. You will also need to install and configure [`serverless` CLI](https://www.serverless.com/framework/docs/getting-started).

### Environment Variables

The following environment variables are required.

| Variable Name              | Description                                                |
| -------------------------- | ---------------------------------------------------------- |
| `AUTH_SECRET_KEY`          | Secret key used for authentication                         |
| `AWS_ACCESS_KEY_ID`        | Amazon Web Services access key ID                          |
| `AWS_REGION`               | Amazon Web Services region                                 |
| `AWS_SECRET_ACCESS_KEY`    | Amazon Web Services access key                             |
| `PGHOST`                   | Postgres host                                              |
| `PGPASSWORD`               | Postgres password                                          |
| `PGUSER`                   | Postgres user                                              |
| `PHYLOPIC_BUILD`           | The number of the current _PhyloPic_ build                 |
| `PHYLOPIC_BUILD_TIMESTAMP` | The timestamp associated with the current _PhyloPic_ build |
| `PHYLOPIC_ROOT_UUID`       | The UUID of the root node for _PhyloPic_                   |

The following environment variables are optional:

| Variable Name | Description                     |
| ------------- | ------------------------------- |
| `PGPORT`      | Postgres port (default: `5432`) |

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

-   **T. Michael Keesey** - [keesey](https://github.com/keesey)

## License

This project is licensed under the [MIT License](../../LICENSE).
