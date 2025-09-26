# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Support for new `Image.tags` and `Submission.tags` properties.

### Changed

### Deprecated

### Fixed

### Removed

### Security

## [1.3.0] - 2025-01-12

### Added

- New methods to Deletor clients: `isRestorable()`, `restore()`.

## [1.2.0] - 2025-01-02

### Added

- New property: `Image.unlisted`.

### Changed

- Made `normalizeBoolean()` more robust.

### Fixed

- `normalizeImage()` included some nonexistent properties.

## [1.1.5] - 2024-11-04

### Changed

- Upgraded AWS SDK for S3.

## [1.1.4] - 2024-04-15

### Changed

- Updates to name normalization.

## [1.1.3] - 2024-04-13

### Changed

- Upgraded all dependencies.
- Switched from `mocha` to `vitest`.

## [1.1.2] - 2023-05-14

### Changed

- Upgraded to TypeScript 5.0.4.

## [1.1.1] - 2023-04-30

### Changed

- Upgraded `next` to `13.3.1`.

## [1.1.0] - 2023-03-24

### Changed

- S3 Listers now return an object with a `Key` and `LastModified`, not just the key.

## [1.0.0] - 2023-02-12
