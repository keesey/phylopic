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

## [2.1.0] - 2023-03-21

### Changed

-   Added slugs to Contributor, Image, and Node Page URLs.

## [2.0.8] - 2023-03-10

### Fixed

-   The _Open Tree of Life_ resolver was not including the search result in the lineage list.

## [2.0.7] - 2023-03-06

### Added

-   More properties to `ImageObject` metadata.

### Removed

-   No longer setting `document.domain`.

## [2.0.6] - 2023-02-29

### Added

-   Blur image and `sizes` attribute for Pocket Phylogenies.

### Changed

-   Not optimizing social media icons in footers.
-   Not including `build` query in silhouette image URLs.
-   Made `alt` text for the backs of Pocket Phylogenies more descriptive.

### Fixed

-   Using more widely-accepted ARIA attribute (`aria-describedby`) for search input description.

## [2.0.5] - 2023-02-21

### Added

-   Redirect for `public/social/1200x1200.png`.

### Removed

-   `public/social/1200x1200.png`

## [2.0.4] - 2023-02-18

### Changed

-   Serving all social media images from `images.phylopic.org`.

### Deprecated

-   `public/social/1200x1200.png`

## [2.0.3] - 2023-02-13

### Added

-   Extra attributes to searchbar form.

## [2.0.2] - 2023-02-13

### Added

-   Vercel analytics.

## [2.0.1] - 2023-02-13

### Changed

-   Removed `lazyOnLoad` strategy for Google Measurement script.

## [2.0.0] - 2023-02-12
