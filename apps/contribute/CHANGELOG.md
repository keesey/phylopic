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
