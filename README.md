# PhyloPic

_[PhyloPic](https://www.phylopic.org)_ is an open database of freely reusable silhouettes of life forms. Code for _PhyloPic_ resides in this [monorepo](https://turborepo.org/docs).

Most of the code for _PhyloPic_ is [TypeScript](https://www.typescriptlang.org/).

## Projects

### Apps

| Project Path                    | Description                                                                                          |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [api](./apps/api)               | Serverless API for accessing _PhyloPic_ data                                                         |
| [api-docs](./apps/api-docs)     | Documentation for the _PhyloPic_ API                                                                 |
| [contribute](./apps/contribute) | Public webapp for contributing silhouette images                                                     |
| [edit](./apps/edit)             | Private webapp (run locally) for managing _PhyloPic_, including contribution review and data editing |
| [publish](./apps/publish)       | Code for administrating _PhyloPic_, including publishing releases and managing source files          |
| [www](./apps/www)               | Public webapp for searching for and viewing silhouette images                                        |

### Packages

| Project Path                                                | Description                                                                   |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [api-models](./packages/api-models)                         | Type declarations and utility files for data models used by the API           |
| [eslint-config-phylopic](./packages/eslint-config-phylopic) | ESLint configurations used throughout the project                             |
| [source-client](./packages/source-client)                   | Client object for reading and writing source models and files                 |
| [source-models](./packages/source-models)                   | Type declarations and utility files for data models used in the source bucket |
| [styles](./packages/styles)                                 | Stylesheet values and mixins                                                  |
| [tsconfig](./packages/tsconfig)                             | Typescript configurations used throughout the project                         |
| [ui](./packages/ui)                                         | Commonly-used React components for user interfaces                            |
| [utils](./packages/utils)                                   | Common code                                                                   |
| [utils-api](./packages/utils-api)                           | Common code related to using the API in a webapp                              |
| [utils-aws](./packages/utils-aws)                           | Common code related to Amazon Web Services                                    |

### Database scripts

The scripts for creating the project's Postgres databases are in [sql](./sql/README.md).

## Getting started

Install [Yarn](https://classic.yarnpkg.com/), and then run `yarn` from the command root to install dependencies.

## Formatting and linting

To clean up formatting for all source files in all projects, run:

```sh
yarn format
```

To lint all source files and automatically fix certain issues:

```sh
yarn lint
```

## Testing

To run unit tests in all projects that have them:

```sh
yarn test
```

## Running locally

To run all apps locally:

```sh
yarn dev
```

Apps will run on the following ports:

| App Project                     | Port   |
| ------------------------------- | ------ |
| [api](./apps/api)               | `3003` |
| [contribute](./apps/contribute) | `3002` |
| [edit](./apps/edit)             | `3001` |
| [www](./apps/www)               | `3000` |

## Releasing versions

The [semantic versioning](https://semver.org/) of the monorepo is only updated when root dependencies are updated (for example, `turborepo`), or potentially when major changes are made. To create a new version:

-   Update `version` in [`package.json`](./package.json).
-   Update [`CHANGELOG.md`](./CHANGELOG.md), moving all `[Unreleased]` items into a new entry for the new version.
-   Commit the changes.
-   Tag the commit with `@phylopic/v[M].[m].[p]`, where `[M]`, `[m]`, and `[p]` are integers denoting the major version, minor version, and patch version, respectively. Example: `@phylopic/v2.0.9`. Push the tag to `origin`.

## Apps and packages

Each subproject (app or package) has its own [semantic versioning](https://semver.org/). To release a new version:

-   Update `version` in the subproject's `package.json`.
-   Update the subproject's `CHANGELOG.md`, moving all `[Unreleased]` items into a new entry for the new version.
-   Commit the changes.
-   Tag the commit with `@phylopic/[subproject]/v[M].[m].[p]`, where `[subproject]` is the name of the project (for example, `www`) and `[M]`, `[m]`, and `[p]` are integers denoting the major version, minor version, and patch version, respectively. Example: `@phylopic/www/v2.6.12`. Push the tag to `origin`.
-   For apps, publish the new version:
    -   For `api` or `api-docs`, run `yarn deploy`.
    -   For `contribute`, reset the `@phylopic/contribute/prod` branch to the release's commit and push to `origin`. Deployment can be monitored in Vercel.
    -   For `www`, reset the `@phylopic/www/prod` branch to the release's commit and push to `origin`. Deployment can be monitored in Vercel.
    -   No action is necessary for `edit` or `publish`, which are only run locally.

## Contributing

To contribute to the development of _PhyloPic_, please read the guidelines in [`CONTRIBUTING.md`](./CONTRIBUTING.md) and contact Mike Keesey ([`keesey+phylopic@gmail.com`](mailto:keesey+phylopic@gmail.com)). The repository is open and may be forked, with pull requests made back into the original repository.

## Further documentation

-   [Contributing](./CONTRIBUTING.md)
-   [AWS S3 Bucket Structure](./S3.md)
-   [Subdomains](./SUBDOMAINS.md)
