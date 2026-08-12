# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

- Upgraded `vitest` from `1.5.0` to `3.2.6`.

### Deprecated

### Fixed

### Removed

### Security

- Upgraded `vite` to `5.4.21` (via `vitest`), fixing path traversal via trailing backslash on
  Windows when the Vite dev server is exposed to the network (CVE-2025-62522).

## [1.1.3] - 2026-08-09

### Security

- Upgraded `@phylopic/utils` to `1.2.2`.
- Upgraded `eslint-config-phylopic` to `1.0.6`.

## [1.1.2] - 2026-08-09

### Added

- `decodeJWT`, `verifyJWT`, and JWT issuer/audience constants for signed contributor tokens.

### Changed

- `isJWT` now checks token structure only; signature verification belongs in `verifyJWT`.

## [1.1.1] - 2026-07-22

### Changed

- Minor upgrades for development dependencies (`prettier`, `tsup`).

### Security

- Patch upgrade for `jsonwebtoken`.

## [1.1.0] - 2025-01-02

### Added

- New property: `Image.unlisted`.

## [1.0.2] - 2024-04-13

### Changed

- Upgraded all dependencies.
- Switched from `mocha` to `vitest`.

## [1.0.1] - 2023-05-14

### Changed

- Upgraded to TypeScript 5.0.4.

## [1.0.0] - 2023-02-12
