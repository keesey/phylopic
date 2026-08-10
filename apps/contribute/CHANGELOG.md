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

## [2.4.10] - 2026-08-10

### Fixed

- S3 and SES OIDC credentials use statically imported `@vercel/functions/oidc` (same bundling fix as
  `@phylopic/www`).

## [2.4.9] - 2026-08-10

### Security

- S3 and SES clients use Vercel OIDC (`AWS_ROLE_ARN`) when configured, falling back to static
  keys for local development. Upgraded `@phylopic/utils-aws` to `1.1.0`; added
  `@vercel/functions`.

## [2.4.8] - 2026-08-10

### Fixed

- Upgraded `@phylopic/ui` to `1.7.12`.

## [2.4.7] - 2026-08-10

### Fixed

- Upgraded `@phylopic/ui` to `1.7.11`.

## [2.4.6] - 2026-08-09

### Security

- Patch upgrade for `next`.
- Upgraded `@phylopic/api-models` to `1.3.7`.
- Upgraded `@phylopic/source-models` to `1.1.3`.
- Upgraded `@phylopic/source-client` to `1.4.2`.
- Upgraded `@phylopic/ui` to `1.7.10`.
- Upgraded `@phylopic/utils` to `1.2.2`.
- Upgraded `@phylopic/utils-api` to `1.0.12`.
- Upgraded `eslint-config-phylopic` to `1.0.6`.

## [2.4.5] - 2026-08-09

### Changed

- Upgraded `@phylopic/source-client` to `1.4.0`.

## [2.4.4] - 2026-08-09

### Changed

- Upgraded `@phylopic/source-client` to `1.3.5`.

## [2.4.3] - 2026-08-09

### Security

- Magic-link sender is rate-limited per IP and email address; over-limit requests still return `204` without sending mail.
- Magic links are single-use: redeeming a link deletes the stored auth token.
- Auth token writes and verification use `verifyJWT` from `@phylopic/source-models` instead of decode-only checks.

## [2.4.2] - 2026-08-09

### Changed

- Upgraded `@phylopic/api-models` to `1.3.6`, `@phylopic/ui` to `1.7.8`, and `@phylopic/utils-api` to `1.0.11`.

## [2.4.1] - 2026-08-09

### Changed

- Upgraded to Node.js 24.

## [2.4.0] - 2026-08-07

### Added

- `GET /api/images/{uuid}/file/link`, which responds with a short-lived link to an image's file, as `{ "href": <URL> }`. Thumbnails of unpublished images load from that link. Requires authorization for the image's contributor.

### Removed

- `GET /api/images/{uuid}/file`, which responded with the contents of an image's file. Replaced by
  `GET /api/images/{uuid}/file/link`.

### Security

- Uploaded files are no longer served from this application's origin.
- All API routes are now authorized.

## [2.3.8] - 2026-08-07

### Changed

- Authorized requests now go through a single request function, rather than each caller attaching its own `Authorization` header.

### Fixed

- Authorization tokens that fail verification, such as those signed with a retired key, are now discarded, and the user is prompted to re-authorize. Previously such tokens persisted indefinitely, leaving the interface in an apparently authorized state while every request failed.
- Failed authorization now responds with `401` instead of `500`.

### Security

- Responses to failed authorization no longer include internal error details.

## [2.3.7] - 2026-07-26

### Added

- `User-Agent` header identifying _PhyloPic_ in requests to the _Paleobiology Database_ (`paleobiodb.org`) API.

### Fixed

- Upgraded `@phylopic/utils-api` to fix `Suspense` errors.

## [2.3.6] - 2026-07-23

### Changed

- Major upgrade for `next`, to version 15.
- Minor upgrade for `next-seo`.
- Updated Next.js configuration for version 15: replaced deprecated `images.domains` with `images.remotePatterns`, removed `swcMinify`, and set `outputFileTracingRoot`.

## [2.3.5] - 2026-07-22

### Changed

- Minor upgrades for `sass` and `swr`.
- Patch upgrade for `clsx`.

### Security

- Minor upgrade for AWS clients, fixing `fast-xml-parser` vulnerabilities.
- Minor upgrade for `sharp`, fixing `libvips` vulnerabilities.
- Patch upgrades for `form-data` and `jsonwebtoken`.

## [2.3.4] - 2026-03-17

### Added

- Splitting out charset from `Content-Type` header for data type checks in error handling.

## [2.3.3] - 2026-01-05

### Changed

- Minor upgrade for AWS SES Client.

## [2.3.2] - 2026-01-05

### Security

- Minor upgrade for `react`.
- Patch upgrade for `next`.

## [2.3.1] - 2024-11-04

### Changed

- Upgraded AWS SDK for SES.

## [2.3.0] - 2024-06-21

### Added

- Ability to edit taxonomic assignment, license, and attribution after submission.

### Changed

- Image review now shows a single image at a time, not a two-up.
- Upgraded Next.js to 14.2.4.

### Fixed

- Fixed sizes for image logos.

## [2.2.9] - 2024-04-13

### Changed

- Upgrades:
    - Node.js 20.
    - All dependencies.
- Switched from `mocha` to `vitest`.

## [2.2.8] - 2024-04-13

### Changed

- Replaced `training.paleobiodb.org` with `paleobiodb.org`.

## [2.2.7] - 2024-03-27

### Added

- Default page title.

## [2.2.6] - 2023-08-30

### Fixed

- Issue with updating build number.

## [2.2.5] - 2023-06-26

### Fixed

- No more flickering between build versions.

## [2.2.4] - 2023-05-19

### Fixed

- Another possible fix for hanging edit screen.

## [2.2.3] - 2023-05-17

### Fixed

- Possible fix for hanging edit screen.

## [2.2.2] - 2023-05-17

### Changed

- Upgraded `@phylopic/utils-api` to `1.0.2`.

## [2.2.1] - 2023-05-14

### Changed

- Upgrades:
    - Node.js 18.
    - TypeScript 5.0.4.

## [2.2.0] - 2023-05-02

### Added

- GBIF to search capabilities.

## [2.1.1] - 2023-04-30

### Changed

- Upgraded `next` to `13.3.1`.

## [2.1.0] - 2023-04-25

### Changed

- Using `GET /resolve/{authority}/{namespace}` instead of `POST /resolve/{authority}/{namespace}` for external resolvers.

## [2.0.11] - 2023-04-21

### Fixed

- Assignment screen was not showing a loader.
- Issue with _Open Tree of Life_ resolver.

## [2.0.10] - 2023-04-01

### Changed

- Refactored Google Analytics code.

## [2.0.9] - 2023-03-24

### Added

- Cache-buster based on modification date for image file views.

### Fixed

- Redirect for social media image was not implemented correctly.

## [2.0.8] - 2023-03-19

### Changed

- Removed schema from some outbound `https` links.
- Replaced `/donate` links with direct URL.
- Updated `rel` attribute for links.

## [2.0.7] - 2023-03-10

### Fixed

- The _Open Tree of Life_ resolver was not including the search result in the lineage list.

## [2.0.6] - 2023-03-06

### Removed

- No longer setting `document.domain`.

## [2.0.5] - 2023-02-29

### Changed

- Not optimizing social media icons in footers.

## [2.0.4] - 2023-02-21

### Added

- Redirect for `public/social/1200x1200.png`.

### Removed

- `public/social/1200x1200.png`

## [2.0.3] - 2023-02-18

### Changed

- Serving all social media images from `images.phylopic.org`.

### Deprecated

- `public/social/1200x1200.png`

## [2.0.2] - 2023-02-13

### Added

- Vercel analytics.

## [2.0.1] - 2023-02-13

### Changed

- Removed `lazyOnLoad` strategy for Google Measurement script.

## [2.0.0] - 2023-02-12
