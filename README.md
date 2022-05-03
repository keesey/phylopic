# PhyloPic

_[PhyloPic](https://www.phylopic.org)_ is an open database of freely reusable silhouettes of life forms. Code for _PhyloPic_ resides in this [monorepo](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/).

## Projects

| Project Path                                      | Description                                                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [api](./packages/api)                             | Serverless API for accessing _PhyloPic_ data.                                                          |
| [api-docs](./packages/api-docs)                   | Documentation for the _PhyloPic_ API.                                                                  |
| [api-models](./packages/api-models)               | Type declarations and utility files for data models used by the API.                                   |
| [publish](./packages/publish)                     | Code for administrating _PhyloPic_, including publishing releases and managing source files.           |
| [source-models](./packages/source-models)         | Type declarations and utility files for data models used in the source bucket.                         |
| [ui](./packages/ui)                               | Commonly-used React components for user interface.                                                     |
| [utils](./packages/utils)                         | Common code.                                                                                           |
| [webapp](./packages/webapp)                       | Public website for searching for and viewing silhouette images.                                        |
| [webapp-contribute](./packages/webapp-contribute) | Public website for contributing silhouette images.                                                     |
| [webapp-edit](./packages/webapp-edit)             | Private website (run locally) for managing _PhyloPic_, including contribution review and data editing. |

## Contributing

To contribute to the development of _PhyloPic_, please read the guidelines in [`CONTRIBUTING.md`](./CONTRIBUTING.md) contact Mike Keesey ([`keesey+phylopic@gmail.com`](keesey+phylopic@gmail.com)). The repository is open and may be forked, with pull requests made back into the original repository.
