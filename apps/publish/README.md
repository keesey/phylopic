# PhyloPic: Publisher

Publishing scripts for _[PhyloPic](https://www.phylopic.org)_ builds.

## Setting up

See instructions in the [_PhyloPic_ project `README`](../../README.md) for setting up the monorepo project.

### Prerequisites

Make sure you have the following installed on your system and reachable via the system path:

-   [AWS CLI](https://aws.amazon.com/cli/) (v2.4.20 or higher)
-   [Image Magick](https://imagemagick.org/script/download.php) (v7.1 or higher)
-   [Inkscape](https://inkscape.org/release/inkscape-1.1.2/) (v1.1 or higher)
-   [Node.js](https://nodejs.org/en/download/) (v16 or higher)
-   [potrace](http://potrace.sourceforge.net/#downloading) (v1.16 or higher)
-   [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) (v1.22 or higher)

### Environment variables

The following environment variables are required. They may be stored in `.env` in the root of this project.

| Variable Name          | Description                                               |
| ---------------------- | --------------------------------------------------------- |
| `PGHOST`               | Postgres host                                             |
| `PGPASSWORD`           | Postgres password                                         |
| `PGUSER`               | Postgres user                                             |
| `REVALIDATE_KEY`       | Key for revalidating the main website pages               |
| `S3_ACCESS_KEY_ID`     | Amazon Web Services S3 access key ID                      |
| `S3_REGION`            | Amazon Web Services S3 region                             |
| `S3_SECRET_ACCESS_KEY` | Amazon Web Services S3 secret access key                  |
| `WWW_URL`              | Root URL of the main website (`https://www.phylopic.org`) |

The following environment variables are optional:

| Variable Name | Description                     |
| ------------- | ------------------------------- |
| `EOL_API_KEY` | Encyclopedia of Life API key    |
| `PGPORT`      | Postgres port (default: `5432`) |

## Running scripts

### Release a new build

This will build and release a new build of the website, created from the files in the `source-images.phylopic.org` bucket and data in the `phylopic-source` database.

```sh
yarn make
```

### Autolink externals

These commands will pull data from external APIs and try to match themn to nodes in the `phylopic-source` database.

```sh
yarn autolink eol
yarn autolink gbif
yarn autolink otol
yarn autolink pbdb
```

### Report silhouette coverage

This command will report coverage statistics for nodes (number of silhouettes per number of terminal nodes, as reported by the _[Open Tree of Life](https://opentreeoflife.github.io/)_).

```sh
yarn coverage <UUID> <UUID> ...
```
