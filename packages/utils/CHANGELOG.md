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

- Require 64-character SHA-256 digests in `isHash`.

## [1.2.3] - 2026-08-11

### Added

- `@phylopic/utils/svg/lite`: regex-based SVG sanitization without DOMPurify/jsdom, for serverless
  runtimes that cannot load the full `@phylopic/utils/svg` stack.

## [1.2.2] - 2026-08-09

### Security

- Upgraded `uuid` to 11.x.
- Upgraded `eslint-config-phylopic` to `1.0.6`.

## [1.2.1] - 2026-08-09

### Security

- SVG sanitization now removes Adobe Illustrator `i:pgf` metadata and orphaned base64 text left behind when DOMPurify strips unknown elements.

## [1.2.0] - 2026-08-09

### Added

- `@phylopic/utils/svg` subpath with DOMPurify-based SVG sanitization (`sanitizeSVG`, `svgNeedsSanitization`, `isLikelySVG`).

## [1.1.2] - 2026-07-22

### Changed

- Minor upgrades for development dependencies (`prettier`, `tsup`).

## [1.1.1] - 2025-01-03

### Added

- New function: `isTrue()`.

## [1.1.0] - 2024-04-15

### Changed

- The `normalizeNomen()` function now:
    - changes "et al." to "& al.".
    - changes "and" to "&".
    - removes commas in citations separating the authorship and year.
    - removes commas before "&".
    - places a space between a period and an ensuing letter.
- The `normalizeNomina()` function now:
    - removes uncited scientific names if an equivalent cited one is present, and the uncited one is not canonical.
    - replaces an uncited canonical scientific name with a cited scientific name, if there is a singe alternative.

## [1.0.2] - 2024-04-13

### Changed

- Upgraded all dependencies.
- Switched from `mocha` to `vitest`.

## [1.0.1] - 2023-05-14

### Changed

- Upgraded to TypeScript 5.0.4.

## [1.0.0] - 2023-02-12
