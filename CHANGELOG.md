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

## [2.0.36] - 2026-08-11

### Fixed

- `@phylopic/api` `2.13.1`: CORS preflight for cross-origin `POST /uploads`.
- `@phylopic/contribute` `2.4.17`: replace invalid stored magic-link token instead of returning
  `403` on authorize.

## [2.0.35] - 2026-08-11

### Changed

- `@phylopic/api` `2.13.0`: removed deprecated `postResolveObjects` and `twitter:image`; upgraded `@phylopic/api-models` to `1.4.0`.
- `@phylopic/api-models` `1.4.0`: removed deprecated `Image._links["twitter:image"]`.
- `@phylopic/publish` `1.12.12`: stopped emitting `twitter:image` in image JSON; upgraded `@phylopic/api-models` to `1.4.0`.
- `@phylopic/contribute` `2.4.16`, `@phylopic/ui` `1.7.13`, `@phylopic/utils-api` `1.0.13`, `@phylopic/www` `2.14.27`: upgraded `@phylopic/api-models` to `1.4.0`.

## [2.0.34] - 2026-08-11

### Changed

- `@phylopic/api` `2.12.0`: HTTPS API documentation on `api-docs.phylopic.org`.
- `@phylopic/www` `2.14.26`: `https://` links to API documentation.

## [2.0.33] - 2026-08-10

### Security

- `@phylopic/api` `2.11.5`: rate-limit unauthenticated `POST /collections`; generic unexpected error messages.
- `@phylopic/source-client` `1.4.3`: generic error messages from `handleAPIError`.
- `@phylopic/contribute` `2.4.15`, `@phylopic/edit` `1.9.15`, `@phylopic/publish` `1.12.10`: upgraded
  `@phylopic/source-client` to `1.4.3`.
- `@phylopic/www` `2.14.25`: escape `<` in JSON-LD script payloads.

## [2.0.32] - 2026-08-10

### Security

- `aws` `1.2.0`: scoped `phylopic-publish` IAM policy for the publication pipeline.
- `@phylopic/publish` `1.12.8`: credential chain fallback for unified operator profile.

## [2.0.31] - 2026-08-10

### Fixed

- `@phylopic/contribute` `2.4.14`: Magic-link redemption for emails that already have a contributor row.

## [2.0.30] - 2026-08-10

### Fixed

- Root `resolutions` pin `jsdom@26.1.0` and `cssstyle@4.2.1` after `jsdom@27` still pulled an
  ESM-only `@csstools/css-calc` chain on serverless.

## [2.0.29] - 2026-08-10

### Fixed

- Root `resolutions` pin `jsdom@27.0.0` and `html-encoding-sniffer@4.0.0` to fix serverless
  `ERR_REQUIRE_ESM` from the `jsdom` 28 / `@exodus/bytes` dependency chain (`@phylopic/contribute`).

## [2.0.28] - 2026-08-10

### Fixed

- `@phylopic/www` `2.14.24`: Remove unpublished `@aws-sdk/credential-provider-web-identity` version pin.
- `@phylopic/contribute` `2.4.11`: Same dependency fix.

## [2.0.27] - 2026-08-10

### Fixed

- `@phylopic/www` `2.14.23`: Permalink creation OIDC/S3 bundling fix.
- `@phylopic/contribute` `2.4.10`: Same OIDC static-import fix for S3/SES.
- `@phylopic/utils-aws` `1.1.1`: Static import of `@vercel/functions/oidc`.

## [2.0.26] - 2026-08-10

### Fixed

- `@phylopic/www` `2.14.22`: Collection Page creation via same-origin API proxy.

## [2.0.25] - 2026-08-10

### Security

- Vercel OIDC federation for `@phylopic/www` and `@phylopic/contribute` (`@phylopic/utils-aws`
  `1.1.0`).

## [2.0.24] - 2026-08-09

### Security

- Yarn resolutions pin transitive dependencies with known vulnerabilities (`postcss`, `sharp`, `serialize-javascript`, `brace-expansion`, `js-yaml`, `nanoid`, `phin`, `xml2js`, `fast-uri`, `core-js-compat`).

## [2.0.23] - 2026-08-09

### Changed

- Upgraded `turbo` to `2.10.9`.

## [2.0.22] - 2026-08-09

### Changed

- Upgraded to Node.js 24.

## [2.0.21] - 2026-07-22

### Changed

- Upgraded `@changesets/cli` to `2.31.1`.
- Upgraded `prettier` to `3.9.6`.

### Security

- Upgraded `turbo` to `2.10.6`.

## [2.0.20] - 2026-03-17

### Changed

- Upgraded `turbo` to `2.8.17`.

## [2.0.19] - 2026-01-05

### Changed

- Upgraded `turbo` to `2.7.2`.

## [2.0.18] - 2025-09-25

### Changed

- Updated `caniuse-lite`.
- Upgraded `@changesets/cli` to `2.29.7`.
- Upgraded `prettier` to `3.6.2`.
- Upgraded `turbo` to `2.5.8`.

## [2.0.17] - 2025-01-23

### Changed

- Upgraded `turbo` to `2.5.4`.

## [2.0.16] - 2025-01-02

### Changed

- Updated `caniuse-lite`.
- Upgraded `turbo` to `2.3.3`.

## [2.0.15] - 2024-07-05

### Changed

- Upgraded `turbo` to `2.0.6`.

## [2.0.14] - 2024-06-21

### Changed

- Upgraded `turbo` to `2.0.4`.

## [2.0.13] - 2024-06-15

### Changed

- Upgraded `turbo` to `2.0.3`.

## [2.0.12] - 2024-04-13

### Changed

- Upgrades:
    - Node.js 20.
    - All dependencies.
- Switched from `mocha` to `vitest`.

## [2.0.11] - 2024-03-27

### Changed

- Upgraded `turbo` to `1.13.0`.

## [2.0.10] - 2024-01-29

### Changed

- Upgraded `turbo` to `1.11.3`.
- Updated `caniuse-lite`.

## [2.0.9] - 2023-06-26

### Changed

- Upgraded `turbo` to `1.10.6`.
- Updated `caniuse-lite`.

## [2.0.8] - 2023-05-17

### Changed

- Upgraded `turbo` to `1.9.7`.

## [2.0.7] - 2023-05-14

### Changed

- Upgrades:
    - Node.js 18.
    - TypeScript 5.0.4.

## [2.0.6] - 2023-04-30

### Changed

- Upgraded `next` to `13.3.1`.

## [2.0.5] - 2023-04-23

### Changed

- Upgraded `turbo` to `1.9.3`.

## [2.0.4] - 2023-04-01

### Changed

- Upgraded `turbo` to `1.8.8`.

## [2.0.3] - 2023-03-24

### Changed

- Upgraded `turbo` to `1.8.5`.

## [2.0.2] - 2023-02-29

### Changed

- Upgraded `turbo` to `1.8.3`.

## [2.0.1] - 2023-02-21

### Changed

- Upgraded `turbo` to `1.8.1`.

## [2.0.0] - 2023-02-12
