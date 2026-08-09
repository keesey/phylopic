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

## [1.0.1] - 2026-08-09

### Changed

- `phylopic-contribute` policy: grant `s3:DeleteObject` on `auth.phylopic.org/emails/*` so single-use magic-link redemption can remove the stored token after `S3Deletor.delete()` copies it to `trash/emails/*`.
- `README.md`: document auth-token delete on the `[jti]` redeem route; update verification steps to confirm a link works once and fails on reuse.

### Security

- Closes the gap where single-use magic links could not actually consume tokens under the scoped contribute principal.

## [1.0.0] - 2026-08-08

### Added

- `policies/`: least-privilege IAM policies for the four application principals (`phylopic-ses-sender`, `phylopic-contribute`, `phylopic-www`, `phylopic-editorial`), each derived from the S3 and SES calls the corresponding app actually makes.
- `create-principals.sh`: idempotent creation of those users with their inline policies. Deliberately does not create access keys.
- `README.md`: derivation of every grant, rollout order, verification steps, and known gaps.

### Security

- Replaced the single shared `AdministratorAccess` credential in the applications' environment variables with per-app principals. `apps/www`, the highest-traffic public app, drops from unrestricted account control to read and write on one bucket prefix; `apps/contribute` can no longer introduce submission files, only manage existing ones; and mail-sending is separated from object storage so the `SES_*` and `S3_*` variable names describe distinct credentials for the first time.
