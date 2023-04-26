# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

-   Support for `existingUUID` field on submissions.

### Changed

### Deprecated

### Fixed

### Removed

### Security

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
