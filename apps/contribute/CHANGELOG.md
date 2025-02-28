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

## [2.3.1] - 2024-11-04

### Changed

-   Upgraded AWS SDK for SES.

## [2.3.0] - 2024-06-21

### Added

-   Ability to edit taxonomic assignment, license, and attribution after submission.

### Changed

-   Image review now shows a single image at a time, not a two-up.
-   Upgraded Next.js to 14.2.4.

### Fixed

-   Fixed sizes for image logos.

## [2.2.9] - 2024-04-13

### Changed

-   Upgrades:
    -   Node.js 20.
    -   All dependencies.
-   Switched from `mocha` to `vitest`.

## [2.2.8] - 2024-04-13

### Changed

-   Replaced `training.paleobiodb.org` with `paleobiodb.org`.

## [2.2.7] - 2024-03-27

### Added

-   Default page title.

## [2.2.6] - 2023-08-30

### Fixed

-   Issue with updating build number.

## [2.2.5] - 2023-06-26

### Fixed

-   No more flickering between build versions.

## [2.2.4] - 2023-05-19

### Fixed

-   Another possible fix for hanging edit screen.

## [2.2.3] - 2023-05-17

### Fixed

-   Possible fix for hanging edit screen.

## [2.2.2] - 2023-05-17

### Changed

-   Upgraded `@phylopic/utils-api` to `1.0.2`.

## [2.2.1] - 2023-05-14

### Changed

-   Upgrades:
    -   Node.js 18.
    -   TypeScript 5.0.4.

## [2.2.0] - 2023-05-02

### Added

-   GBIF to search capabilities.

## [2.1.1] - 2023-04-30

### Changed

-   Upgraded `next` to `13.3.1`.

## [2.1.0] - 2023-04-25

### Changed

-   Using `GET /resolve/{authority}/{namespace}` instead of `POST /resolve/{authority}/{namespace}` for external resolvers.

## [2.0.11] - 2023-04-21

### Fixed

-   Assignment screen was not showing a loader.
-   Issue with _Open Tree of Life_ resolver.

## [2.0.10] - 2023-04-01

### Changed

-   Refactored Google Analytics code.

## [2.0.9] - 2023-03-24

### Added

-   Cache-buster based on modification date for image file views.

### Fixed

-   Redirect for social media image was not implemented correctly.

## [2.0.8] - 2023-03-19

### Changed

-   Removed schema from some outbound `https` links.
-   Replaced `/donate` links with direct URL.
-   Updated `rel` attribute for links.

## [2.0.7] - 2023-03-10

### Fixed

-   The _Open Tree of Life_ resolver was not including the search result in the lineage list.

## [2.0.6] - 2023-03-06

### Removed

-   No longer setting `document.domain`.

## [2.0.5] - 2023-02-29

### Changed

-   Not optimizing social media icons in footers.

## [2.0.4] - 2023-02-21

### Added

-   Redirect for `public/social/1200x1200.png`.

### Removed

-   `public/social/1200x1200.png`

## [2.0.3] - 2023-02-18

### Changed

-   Serving all social media images from `images.phylopic.org`.

### Deprecated

-   `public/social/1200x1200.png`

## [2.0.2] - 2023-02-13

### Added

-   Vercel analytics.

## [2.0.1] - 2023-02-13

### Changed

-   Removed `lazyOnLoad` strategy for Google Measurement script.

## [2.0.0] - 2023-02-12
