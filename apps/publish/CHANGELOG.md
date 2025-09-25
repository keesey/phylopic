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

## [1.8.0] - 2025-09-25

### Added

-   Autolinker for NCBI taxon IDs.

## [1.7.3] - 2025-05-10

### Added

-   Instead of just checking if an image needs to be updating by comparing the source image against the published source image, also checking if the raster, social, and thumbnail images exist.

### Changed

-   Dividing image processing into up to 216 tasks instead of 16.

## [1.7.2] - 2025-01-03

### Added

-   Optional `unlisted` property for API `Image` model.

## [1.7.1] - 2025-01-02

### Fixed

-   Not using unlisted images as direct node images.

## [1.7.0] - 2025-01-02

### Added

-   Handling for unlisted images and contributors.

## [1.6.2] - 2025-01-02

### Fixed

-   Helpful console messages weren't showing up.

## [1.6.1] - 2024-11-25

### Changed

-   More helpful console messages for `autolink`.

## [1.6.0] - 2024-11-04

### Added

-   A new step in the `release` script to invalidate the CloudFront distribution for the API.

### Changed

-   Upgraded AWS SDKs.

## [1.5.0] - 2024-04-15

### Added

-   New script: `normalize`.

### Changed

-   Updates to name normalization.

## [1.4.3] - 2024-04-14

### Changed

-   Upgraded `simple-digraph` to `1.1.0`.
-   More informative error message on `insert` tasks when a cycle is encountered.

## [1.4.2] - 2024-04-13

### Fixed

-   Working around an incompatibility between Node.js 20 and `ts-node`.

## [1.4.1] - 2024-04-13 [YANKED]

### Changed

-   Upgrades:
    -   Node.js 20.
    -   All dependencies.
-   Switched from `mocha` to `vitest`.

## [1.4.0] - 2023-12-18

### Added

-   Sanitization of `vectorFile` images (re-vectorized from largest raster).

## [1.3.1] - 2023-05-14

### Added

-   Upgraded to TypeScript 5.0.4.

## [1.3.0] - 2023-05-02

### Added

-   Autolinking for GBIF.

## [1.2.0] - 2023-03-24

### Added

-   Inserting `modified` and `modified_file` for `image` entities.
-   Including `modified` and `modifiedFile` in `image` JSON.

## [1.1.0] - 2023-03-21

### Changed

-   Including titles with most links in entities.

## [1.0.0] - 2023-02-12
