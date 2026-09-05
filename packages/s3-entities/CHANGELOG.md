# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release.
- `ENTITIES_BUCKET` constant (`process.env.ENTITIES_BUCKET` or `entities.phylopic.org`).

### Changed

### Deprecated

### Fixed

### Removed

- `getLineageIndexKey`, `getLineagePageKey`, and `getResolveJSONKey` (lineage and resolve are served from Postgres, not S3).

### Security
