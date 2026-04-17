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

## [1.1.1] - 2025-01-03

### Added

-   New function: `isTrue()`.

## [1.1.0] - 2024-04-15

### Changed

-   The `normalizeNomen()` function now:
    -   changes "et al." to "& al.".
    -   changes "and" to "&".
    -   removes commas in citations separating the authorship and year.
    -   removes commas before "&".
    -   places a space between a period and an ensuing letter.
-   The `normalizeNomina()` function now:
    -   removes uncited scientific names if an equivalent cited one is present, and the uncited one is not canonical.
    -   replaces an uncited canonical scientific name with a cited scientific name, if there is a singe alternative.

## [1.0.2] - 2024-04-13

### Changed

-   Upgraded all dependencies.
-   Switched from `mocha` to `vitest`.

## [1.0.1] - 2023-05-14

### Changed

-   Upgraded to TypeScript 5.0.4.

## [1.0.0] - 2023-02-12
