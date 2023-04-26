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

## [1.5.0] - 2023-04-25

### Changed

-   Using `GET /resolve/{authority}/{namespace}` instead of `POST /resolve/{authority}/{namespace}` for external resolvers.

## [1.4.1] - 2023-04-21

### Fixed

-   Issue with _Open Tree of Life_ resolver.

## [1.4.0] - 2023-04-01

### Added

-   Analytics code (GA4).
-   `onPage()` property for `PaginationContainer`.

### Fixed

-   Missing dependency in `useImageLoader()`.
-   Alignment of `InfiniteScroll` loader.

## [1.3.0] - 2023-03-26

### Added

-   Passing `isLoading` from `PaginationContainer`.

## [1.2.1] - 2023-03-24

### Added

-   Cache-buster based on modification date for image file views.

## [1.2.0] - 2023-03-21

### Changed

-   `ImageRasterView` and `ImageThumbnailView` no longer take `ImageWithEmbedded`. The `alt` values are now based on `_links.self.title`.

### Removed

-   The `useImageAlt()` function.

## [1.1.1] - 2023-03-10

### Fixed

-   The _Open Tree of Life_ resolver was not including the search result in the lineage list.

## [1.1.0] - 2023-02-29

### Added

-   Function for generating flat-color blur images (`rgbDataURL()`).

## [1.0.0] - 2023-02-12
