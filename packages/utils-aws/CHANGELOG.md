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

## [1.1.3] - 2026-08-19

### Security

- Set `ServerSideEncryption: AES256` on S3 `PutObject` helpers.

## [1.1.2] - 2026-08-12

### Added

- Unit tests for all exported functions (`createAwsClientConfig`, `isAWSError`, and S3 helpers).

### Changed

- Peer and dev dependency `@aws-sdk/client-s3` upgraded to `^3.1093.0` to match consuming apps.
- Upgraded `vitest` from `3.2.6` to `4.1.10`.
- Upgraded `@phylopic/utils` to `1.2.4`.

## [1.1.1] - 2026-08-10

### Fixed

- `createAwsClientConfig` statically imports `@vercel/functions/oidc` instead of using a dynamic
  `require`, which Next.js bundling could break at runtime.

## [1.1.0] - 2026-08-10

### Added

- `createAwsClientConfig`: builds AWS SDK client config from `AWS_ROLE_ARN` (Vercel OIDC via
  `@vercel/functions/oidc`) or static access-key env vars for local development.

### Security

- Enables Vercel deployments to authenticate with short-lived credentials instead of long-lived
  access keys when `AWS_ROLE_ARN` is set.

## [1.0.7] - 2026-08-09

### Security

- Upgraded `@phylopic/utils` to `1.2.2`.
- Upgraded `eslint-config-phylopic` to `1.0.6`.

## [1.0.6] - 2026-08-08

### Added

- `deletePrefix` for deleting all objects under an S3 key prefix (used for entity build cleanup).
- `putJSONString` for uploading a pre-serialized JSON string to S3 (same bytes as stored in Postgres).

## [1.0.5] - 2026-07-22

### Changed

- Minor upgrades for development dependencies (`prettier`, `tsup`).

### Removed

- Extraneous `stream` package (shim for a Node.js built-in module).

## [1.0.4] - 2026-01-05

### Changed

- Minor upgrade for AWS clients.

## [1.0.3] - 2025-01-16

### Fixed

- Spacing in error message when objects are invalid.

## [1.0.2] - 2024-04-13

### Changed

- Upgraded all dependencies.
- Switched from `mocha` to `vitest`.

## [1.0.1] - 2023-05-14

### Changed

- Upgraded to TypeScript 5.0.4.

## [1.0.0] - 2023-02-12
