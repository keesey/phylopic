# PhyloPic

_[PhyloPic](https://www.phylopic.org)_ is an open database of freely reusable silhouettes of life forms. Code for _PhyloPic_ resides in this [monorepo](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/).

## Projects

### Apps

| Project Path                    | Description                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [api](./apps/api)               | Serverless API for accessing _PhyloPic_ data.                                                         |
| [api-docs](./apps/api-docs)     | Documentation for the _PhyloPic_ API.                                                                 |
| [contribute](./apps/contribute) | Public webapp for contributing silhouette images.                                                     |
| [edit](./apps/edit)             | Private webapp (run locally) for managing _PhyloPic_, including contribution review and data editing. |
| [publish](./apps/publish)       | Code for administrating _PhyloPic_, including publishing releases and managing source files.          |
| [www](./apps/www)               | Public webapp for searching for and viewing silhouette images.                                        |

### Packages

| Project Path                                                | Description                                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [api-models](./packages/api-models)                         | Type declarations and utility files for data models used by the API.           |
| [eslint-config-phylopic](./packages/eslint-config-phylopic) | ESLint configurations used throughout the project.                             |
| [source-models](./packages/source-models)                   | Type declarations and utility files for data models used in the source bucket. |
| [styles](./packages/styles)                                 | Stylesheet values and mixins.                                                  |
| [tsconfig](./packages/tsconfig)                             | Typescript configurations used throughout the project.                         |
| [ui](./packages/ui)                                         | Commonly-used React components for user interfaces.                            |
| [utils](./packages/utils)                                   | Common code.                                                                   |
| [utils-api](./packages/utils-api)                           | Common code related for using the API in a webapp.                             |
| [utils-aws](./packages/utils-aws)                           | Common code related to Amazon Web Services.                                    |

### Database Scripts

The script for creating the project's Postgres database is in [sql/create.sql](./sql/create.sql).

## Contributing

To contribute to the development of _PhyloPic_, please read the guidelines in [`CONTRIBUTING.md`](./CONTRIBUTING.md) and contact Mike Keesey ([`keesey+phylopic@gmail.com`](keesey+phylopic@gmail.com)). The repository is open and may be forked, with pull requests made back into the original repository.
