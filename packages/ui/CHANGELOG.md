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

## [1.7.17] - 2026-09-02

### Security

- Minor upgrade for `sharp`, fixing `libvips` vulnerabilities.
- Patch upgrade for `nanoid`.

## [1.7.16] - 2026-08-29

### Fixed

- PBDB and OTOL external resolve fetchers validate resolved nodes with `isNodeWithEmbedded`
  before storing them in search state.
- `useExternalResolutions` skips resolved nodes that fail validation.

## [1.7.15] - 2026-08-12

### Changed

- Upgraded `@phylopic/api-models` to `1.4.1`.
- Upgraded `@phylopic/utils` to `1.2.4`.
- Upgraded `@phylopic/utils-api` to `1.0.15`.

## [1.7.14] - 2026-08-11

### Fixed

- External autocomplete fetchers send `Accept: application/json` so GBIF and similar APIs do not
  return `406`.
- Development Content Security Policy allows `localhost` and `127.0.0.1` WebSocket and HTTP
  connections (Next.js dev server binding mismatch).

### Changed

- Upgraded `@phylopic/utils-api` to `1.0.14`.

## [1.7.13] - 2026-08-11

### Changed

- Upgraded `@phylopic/api-models` to `1.4.0`.

## [1.7.12] - 2026-08-10

### Fixed

- No longer setting a `User-Agent` header on client-side requests to the _Paleobiology Database_ API.

## [1.7.11] - 2026-08-10

### Fixed

- Content Security Policy allows Google Fonts and Google Tag Manager used by the apps.

## [1.7.10] - 2026-08-09

### Security

- Patch upgrade for `next`.
- Upgraded `@phylopic/api-models` to `1.3.7`.
- Upgraded `@phylopic/utils` to `1.2.2`.
- Upgraded `@phylopic/utils-api` to `1.0.12`.
- Upgraded `eslint-config-phylopic` to `1.0.6`.

## [1.7.9] - 2026-08-09

### Added

- Shared `securityHeaders` module for Next.js `headers()` configuration.

## [1.7.8] - 2026-08-09

### Changed

- Upgraded `@phylopic/api-models` to `1.3.6` and `@phylopic/utils-api` to `1.0.11`.

## [1.7.7] - 2026-07-26

### Added

- `User-Agent` header identifying _PhyloPic_ in requests to the _Paleobiology Database_ (`paleobiodb.org`) API.

### Fixed

- Upgraded `@phylopic/utils-api` to fix `Suspense` errors.

## [1.7.6] - 2026-07-23

### Changed

- Major upgrade for `next` dependency and peer dependency, to version 15.

## [1.7.5] - 2026-07-22

### Changed

- Minor upgrade for `swr`.
- Patch upgrade for `clsx`.

### Security

- Minor upgrade for `axios`.
- Minor upgrade for `sharp`, fixing `libvips` vulnerabilities.

## [1.7.4] - 2026-03-17

### Added

- Splitting out charset from `Content-Type` header for data type checks in error handling.

## [1.7.3] - 2026-01-05

### Security

- Minor upgrade for `react`.
- Patch upgrade for `next`.

## [1.7.2] - 2024-04-13

### Changed

- Upgraded all dependencies.

## [1.7.1] - 2024-04-13

### Changed

- Replaced `training.paleobiodb.org` with `paleobiodb.org`.

## [1.7.0] - 2024-03-30

### Changed

- Renamed `PBDBRecord` to `PBDBTaxonRecord`.

## [1.6.2] - 2023-05-17

### Changed

- Upgraded `@phylopic/utils-api` to `1.0.2`.

## [1.6.1] - 2023-05-14

### Changed

- Upgraded to TypeScript 5.0.4.

## [1.6.0] - 2023-05-02

### Added

- `GBIFAutocomplete` and `GBIFResolve`.

### Changed

- Renamed `OTOLAutocompleteName` to `OTOLAutocomplete`.

## [1.5.1] - 2023-04-30

### Changed

- Upgraded `next` to `13.3.1`.

## [1.5.0] - 2023-04-25

### Changed

- Using `GET /resolve/{authority}/{namespace}` instead of `POST /resolve/{authority}/{namespace}` for external resolvers.

## [1.4.1] - 2023-04-21

### Fixed

- Issue with _Open Tree of Life_ resolver.

## [1.4.0] - 2023-04-01

### Added

- Analytics code (GA4).
- `onPage()` property for `PaginationContainer`.

### Fixed

- Missing dependency in `useImageLoader()`.
- Alignment of `InfiniteScroll` loader.

## [1.3.0] - 2023-03-26

### Added

- Passing `isLoading` from `PaginationContainer`.

## [1.2.1] - 2023-03-24

### Added

- Cache-buster based on modification date for image file views.

## [1.2.0] - 2023-03-21

### Changed

- `ImageRasterView` and `ImageThumbnailView` no longer take `ImageWithEmbedded`. The `alt` values are now based on `_links.self.title`.

### Removed

- The `useImageAlt()` function.

## [1.1.1] - 2023-03-10

### Fixed

- The _Open Tree of Life_ resolver was not including the search result in the lineage list.

## [1.1.0] - 2023-02-29

### Added

- Function for generating flat-color blur images (`rgbDataURL()`).

## [1.0.0] - 2023-02-12
