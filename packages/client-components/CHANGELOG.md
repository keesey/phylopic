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

## [1.0.2] - 2026-10-02

### Changed

- Search resolves each Open Tree of Life, GBIF, and Paleobiology Database suggestion with one
  `GET /resolve/{authority}/{namespace}?objectIDs=...` request (the suggestion's ID followed by its lineage) instead of
  up to three. Falls back to the suggestion's ID alone if the external lineage request fails.

### Fixed

- Paleobiology Database resolution includes the `build` query parameter and updates when the build changes.

## [1.0.1] - 2026-10-02

### Security

- Upgraded `@phylopic/ui` to `1.8.1`.
- Patch upgrade for `sharp`, fixing `libheif` vulnerabilities.

## [1.0.0] - 2026-09-17

### Added

- Client-side UI modules moved from `@phylopic/ui`, including analytics, search, SWR data containers, and pagination.
- `BuildContainer` and `BuildContext` (previously in `@phylopic/utils-api`).
- Ability to filter image searches by license.

### Changed

- Re-export `getImageLoader` from `@phylopic/ui`.
- Declare `@phylopic/ui` and `@react-hook/debounce` dependencies.
- Request `embed_items` in image search queries.
