# PhyloPic: Publisher

Publishing scripts for _[PhyloPic](https://www.phylopic.org)_ builds.

## Setting Up

See instructions in the [_PhyloPic_ project `README`](../../README.md) for setting up the monorepo project.

### Prerequisites

Make sure you have the following installed on your system and reachable via the system path:

-   [AWS CLI](https://aws.amazon.com/cli/) (v2.4.20 or higher)
-   [Image Magick](https://imagemagick.org/script/download.php) (v7.1 or higher)
-   [Inkscape](https://inkscape.org/release/inkscape-1.1.2/) (v1.1 or higher)
-   [Node.js](https://nodejs.org/en/download/) (v16 or higher)
-   [potrace](http://potrace.sourceforge.net/#downloading) (v1.16 or higher)
-   [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) (v1.22 or higher)

### Environment Variables

The following environment variables are required. They may be stored in `.env` in the root of this project.

| Variable Name           | Description                           |
| ----------------------- | ------------------------------------- |
| `AWS_ACCESS_KEY_ID`     | Amazon Web Services access key ID     |
| `AWS_REGION`            | Amazon Web Services region            |
| `AWS_SECRET_ACCESS_KEY` | Amazon Web Services secret access key |
| `PGHOST`                | Postgres host                         |
| `PGPASSWORD`            | Postgres password                     |
| `PGUSER`                | Postgres user                         |

The following environment variables are optional:

| Variable Name | Description                     |
| ------------- | ------------------------------- |
| `EOL_API_KEY` | Encyclopedia of Life API key    |
| `PGPORT`      | Postgres port (default: `5432`) |

## Running Scripts

### Release a New Build

This will build and release a new build of the website, created from the files in the `source.phylopic.org` bucket.

```sh
yarn make
```

### Heal Source Data

To find errors in the `source.phylopic.org` bucket and try to auto-correct them, run:

```sh
yarn heal
```

### CLI

The _PhyloPic_ Command Line Interface is a way to perform some maintenance and editing tasks. To start it, run:

```sh
yarn cli
```

Once at the prompt, type `help` to see a list of commands.
