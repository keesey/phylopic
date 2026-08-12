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

- Set `ServerSideEncryption: AES256` on `S3Editor` puts.

## [1.4.5] - 2026-08-11

### Fixed

- Serialize the initial Postgres pool connection in `PoolClientProvider.getPG()` so parallel callers
  no longer race on a `max: 1` pool (fixes node absorb/merge timeouts).

## [1.4.4] - 2026-08-11

### Added

- `createSourcePool()` for serverless apps: one Postgres connection per instance (`max: 1`), matching
  `@phylopic/api` pool settings.

## [1.4.3] - 2026-08-10

### Security

- Return generic messages from `handleAPIError` for AWS and unexpected failures.

## [1.4.2] - 2026-08-09

### Security

- Upgraded `@phylopic/source-models` to `1.1.3`.
- Upgraded `@phylopic/utils` to `1.2.2`.
- Upgraded `@phylopic/utils-aws` to `1.0.7`.
- Upgraded `eslint-config-phylopic` to `1.0.6`.

## [1.4.1] - 2026-08-09

### Changed

- Upgraded `@phylopic/utils/svg` to `1.2.1`.

## [1.4.0] - 2026-08-09

### Security

- SVG source images are sanitized with DOMPurify before being written to S3 (`writeImageFile`).

## [1.3.5] - 2026-08-09

### Fixed

- `writeJWT` imports `invalidate` from `@phylopic/utils` instead of `@phylopic/source-models`.

## [1.3.4] - 2026-08-09

### Security

- `writeJWT` now verifies JWT signatures with `AUTH_SECRET_KEY` before persisting auth tokens.

## [1.3.3] - 2026-07-22

### Changed

- Minor upgrades for development dependencies (`@types/pg`, `prettier`, `tsup`).

## [1.3.2] - 2026-01-05

### Changed

- Minor upgrade for AWS clients.

## [1.3.1] - 2026-01-05

### Security

- Patch upgrade for `next`.

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
