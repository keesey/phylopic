# _PhyloPic_ Editing Webapp

This [Next.js](https://nextjs.org/) application allows users to manage data for [_PhyloPic_](https://www.phylopic.org), including phylogenetic nodes and silhouette images. It includes the interface for reviewing images uploaded via the [Contribute webapp](../contribute).

This app is only meant to be run locally. It is not hosted online.

## Getting started

See instructions in the [_PhyloPic_ project `README`](../../README.md) for setting up the monorepo project.

### Environment variables

The following environment variables are required. They may be stored in `.env.local` in the root of this project, when running the project locally.

| Variable Name          | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | Root URL of the _PhyloPic_ API (`https://api.phylopic.org`) |
| `PGHOST`               | Postgres host                                               |
| `PGPASSWORD`           | Postgres password                                           |
| `PGUSER`               | Postgres user                                               |
| `S3_ACCESS_KEY_ID`     | Amazon Web Services S3 access key ID                        |
| `S3_REGION`            | Amazon Web Services S3 region                               |
| `S3_SECRET_ACCESS_KEY` | Amazon Web Services S3 secret access key                    |

The following environment variables are optional:

| Variable Name | Description                     |
| ------------- | ------------------------------- |
| `PGPORT`      | Postgres port (default: `5432`) |

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
