# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Client-side UI modules moved from `@phylopic/ui`, including analytics, search, SWR data containers, and pagination.
- `BuildContainer` and `BuildContext` (previously in `@phylopic/utils-api`).
- Ability to filter image searches by license.

### Changed

- Re-export `getImageLoader` from `@phylopic/ui`.
- Declare `@phylopic/ui` and `@react-hook/debounce` dependencies.
- Request `embed_items` in image search queries.

### Deprecated

### Fixed

### Removed

### Security
