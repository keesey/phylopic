# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Deprecated

### Fixed

### Removed

### Security

## [1.7.0] - 2025-01-02

### Added

-   Control for whether an image is listed or not.

## [1.6.0] - 2024-11-25

### Changed

-   Redirecting to original target node when an external is deactivated, instead of the Nodes Page.

## [1.5.5] - 2024-06-21

### Changed

-   Upgraded Next.js to 14.2.4.

## [1.5.4] - 2024-04-15

### Changed

-   Updates to name normalization.
-   Normalizing name lists in _GBIF_ and _Open Tree of Life_ resolvers.

## [1.5.3] - 2024-04-14

### Changed

-   Upgraded `simple-digraph` to `1.1.1`.

## [1.5.2] - 2024-04-13

### Changed

-   Upgraded all dependencies.

## [1.5.1] - 2024-04-13

### Changed

-   Replaced `training.paleobiodb.org` with `paleobiodb.org`.

## [1.5.0] - 2024-03-27

### Added

-   Showing incomplete submissions as faded.

## [1.4.1] - 2024-02-17

### Fixed

-   Linting issues.

## [1.4.0] - 2024-02-17

### Added

-   Redirects for image and node links with slugs.

## [1.3.1] - 2023-11-05

### Fixed

-   Links to submissions for Contributor Pages.

## [1.3.0] - 2023-11-05

### Added

-   Contributor Pages.

## [1.2.4] - 2023-06-26

### Fixed

-   No more flickering between build versions.

## [1.2.2] - 2023-05-17

### Changed

-   Upgraded `@phylopic/utils-api` to `1.0.2`.

## [1.2.1] - 2023-05-14

### Changed

-   Upgrades:
    -   Node.js 18.
    -   TypeScript 5.0.4.

## [1.2.0] - 2023-05-02

### Added

-   GBIF to search capabilities.

## [1.1.1] - 2023-04-30

### Changed

-   Upgraded `next` to `13.3.1`.

## [1.1.0] - 2023-04-25

### Changed

-   Using `GET /resolve/{authority}/{namespace}` instead of `POST /resolve/{authority}/{namespace}` for external resolvers.

## [1.0.3] - 2023-04-22

### Fixed

-   Issue with _Open Tree of Life_ resolver.

### Removed

-   Console logging for reducers.

## [1.0.2] - 2023-03-24

### Changed

-   Updates for revisions to `SourceClient`.
-   No longer updating `image` entity's `modified` timestamp when file is updated.

## [1.0.1] - 2023-03-10

### Fixed

-   The _Open Tree of Life_ resolver was not including the search result in the lineage list.

## [1.0.0] - 2023-02-12
