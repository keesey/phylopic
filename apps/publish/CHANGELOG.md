# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

- Upgraded `@phylopic/utils-aws`; `@aws-sdk/client-s3` peer dependency now `^3.1093.0`.

### Fixed

### Removed

### Security

## [1.12.13] - 2026-08-11

### Changed

- Upgraded `@phylopic/source-client` to `1.4.5`.

## [1.12.12] - 2026-08-11

### Changed

- Upgraded `@phylopic/api-models` to `1.4.0`.

### Removed

- `Image._links["twitter:image"]` from published image JSON (use `http://ogp.me/ns#image` instead).

## [1.12.11] - 2026-08-10

### Added

- `AWS_PROFILE=phylopic-publish` on publish `package.json` scripts that call AWS.

## [1.12.10] - 2026-08-10

### Security

- Upgraded `@phylopic/source-client` to `1.4.3`.

## [1.12.9] - 2026-08-10

### Fixed

- Preprocess SVG sanitization strips corrupted Adobe Illustrator CDATA prefixes (`]&gt;`, etc.)
  that caused `yarn make` insert failures on a small set of legacy source files.

## [1.12.8] - 2026-08-10

### Changed

- `SourceClient` uses the default AWS credential chain when `S3_*` is omitted, so
  `AWS_PROFILE=phylopic-publish` covers the full `yarn make` pipeline.

### Security

- Documented scoped `phylopic-publish` IAM profile (`aws/policies/phylopic-publish.json`) in
  place of the administrator CLI profile for release.

## [1.12.7] - 2026-08-10

### Security

- Revalidation script sends `POST /api/revalidate` with an `Authorization: Bearer` header and requires `REVALIDATE_TOKEN` at startup.

## [1.12.6] - 2026-08-09

### Security

- Upgraded `@phylopic/api-models` to `1.3.7`.
- Upgraded `@phylopic/source-models` to `1.1.3`.
- Upgraded `@phylopic/source-client` to `1.4.2`.
- Upgraded `@phylopic/utils` to `1.2.2`.
- Upgraded `@phylopic/utils-aws` to `1.0.7`.
- Upgraded `eslint-config-phylopic` to `1.0.6`.

## [1.12.5] - 2026-08-09

### Changed

- Upgraded `@phylopic/utils/svg` to `1.2.1`.

## [1.12.4] - 2026-08-09

### Changed

- Upgraded `@phylopic/source-client` to `1.4.0`.

## [1.12.3] - 2026-08-09

### Changed

- Upgraded `@phylopic/source-client` to `1.3.5`.

## [1.12.2] - 2026-08-09

### Changed

- Upgraded `@phylopic/api-models` to `1.3.6`.

## [1.12.1] - 2026-08-09

### Changed

- Upgraded to Node.js 24.

## [1.12.0] - 2026-08-08

### Added

- Entity JSON dual-write to S3 (`entities.phylopic.org`) during `yarn insert`, mirroring Postgres `json` columns for contributors, images, and nodes.
- S3 build cleanup on insert (abort recovery) and release (drop old builds).
- `yarn verify:entities <build>` to spot-check Postgres vs. S3 parity.

## [1.11.3] - 2026-08-08

### Fixed

- Revalidation script now reads `REVALIDATE_TOKEN`, matching `apps/www` and this project's `.env`. It previously read the unset name `REVALIDATE_KEY` and sent an empty secret.

## [1.11.2] - 2026-07-26

### Added

- `User-Agent` header identifying PhyloPic in requests to the _Paleobiology Database_ (`paleobiodb.org`) API.

## [1.11.1] - 2026-07-22

### Changed

- Minor upgrades for `pg` and `probe-image-size`.

### Removed

- Extraneous `path` and `readline` packages (shims for Node.js built-in modules).

### Security

- Minor upgrade for `axios`.
- Minor upgrade for AWS clients, fixing `fast-xml-parser` vulnerabilities.

## [1.11.0] - 2026-04-13

### Added

- Dry run option for `insert` script.

## [1.10.0] - 2026-03-31

### Added

- Exponential retries for autolink calls to external APIs (`429` and `5xx` errors).

### Changed

- Adjusted NCBI autolink bottleneck to avoid `429` errors.

## [1.9.2] - 2026-02-01

### Fixed

- Catching errors for GBIF autolinker so that entire process is not stopped for one failed request.

## [1.9.1] - 2026-01-05

### Changed

- Minor upgrade for AWS clients.

## [1.9.0] - 2025-09-30

### Added

- Throttling requests for `ncbi` autolinker.

## [1.8.0] - 2025-09-25

### Added

- Autolinker (`ncbi`) for NCBI taxon IDs.

## [1.7.3] - 2025-05-10

### Added

- Instead of just checking if an image needs to be updating by comparing the source image against the published source image, also checking if the raster, social, and thumbnail images exist.

### Changed

- Dividing image processing into up to 216 tasks instead of 16.

## [1.7.2] - 2025-01-03

### Added

- Optional `unlisted` property for API `Image` model.

## [1.7.1] - 2025-01-02

### Fixed

- Not using unlisted images as direct node images.

## [1.7.0] - 2025-01-02

### Added

- Handling for unlisted images and contributors.

## [1.6.2] - 2025-01-02

### Fixed

- Helpful console messages weren't showing up.

## [1.6.1] - 2024-11-25

### Changed

- More helpful console messages for `autolink`.

## [1.6.0] - 2024-11-04

### Added

- A new step in the `release` script to invalidate the CloudFront distribution for the API.

### Changed

- Upgraded AWS SDKs.

## [1.5.0] - 2024-04-15

### Added

- New script: `normalize`.

### Changed

- Updates to name normalization.

## [1.4.3] - 2024-04-14

### Changed

- Upgraded `simple-digraph` to `1.1.0`.
- More informative error message on `insert` tasks when a cycle is encountered.

## [1.4.2] - 2024-04-13

### Fixed

- Working around an incompatibility between Node.js 20 and `ts-node`.

## [1.4.1] - 2024-04-13 [YANKED]

### Changed

- Upgrades:
    - Node.js 20.
    - All dependencies.
- Switched from `mocha` to `vitest`.

## [1.4.0] - 2023-12-18

### Added

- Sanitization of `vectorFile` images (re-vectorized from largest raster).

## [1.3.1] - 2023-05-14

### Added

- Upgraded to TypeScript 5.0.4.

## [1.3.0] - 2023-05-02

### Added

- Autolinking for GBIF.

## [1.2.0] - 2023-03-24

### Added

- Inserting `modified` and `modified_file` for `image` entities.
- Including `modified` and `modifiedFile` in `image` JSON.

## [1.1.0] - 2023-03-21

### Changed

- Including titles with most links in entities.

## [1.0.0] - 2023-02-12
