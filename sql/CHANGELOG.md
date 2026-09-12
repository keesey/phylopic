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

## [2.4.0] - 2025-08-07

### Added

- `roles.sql`: least-privilege login roles (`phylopic_api`, `phylopic_source`, `phylopic_publish`), with per-database grants derived from the statements each app actually executes.

### Security

- Replaced the single shared database credential with per-consumer roles. The internet-facing API role is now read-only apart from `INSERT` on `collection`, and has no access to the `phylopic-source` system of record.

## [2.3.0] - 2025-01-02

### Added

- New source column: `image.unlisted`.
- New entities columns: `contributor.unlisted`, `image.unlisted`.

## [2.2.0] - 2023-03-24

### Added

- New columns to `image`: `modified`, `modified_file`.

## [2.1.0] - 2023-03-21

### Added

- New column, `title`, to entities.

## [2.0.0] - 2023-02-12
