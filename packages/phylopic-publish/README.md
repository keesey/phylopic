# PhyloPic: Publisher

Publishing scripts for _[PhyloPic](https://www.phylopic.org)_ builds.

## Setting Up

### Prerequisites

Make sure you have the following installed on your system and reachable via the system path:

-   [Node.js](https://nodejs.org/en/download/) (v16 or higher)
-   [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) (v1.22 or higher)
-   [Image Magick](https://imagemagick.org/script/download.php) (v7.1 or higher)
-   [Inkscape](https://inkscape.org/release/inkscape-1.1.2/) (v1.1 or higher)
-   [potrace](http://potrace.sourceforge.net/#downloading) (v1.16 or higher)

### Dependencies

To install dependencies, run:

```sh
yarn
```

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

### Client

The _PhyloPic_ client is a way to perform some maintenance and editing tasks. To start it, run:

```sh
yarn cli
```

Once at the prompt, type `help` to see a list of commands.

### Formatting

To cleanly format all source files, run:

```sh
yarn format
```
