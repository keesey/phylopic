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

## [1.1.2] - 2026-08-10

### Added

- `retire-vercel-scoped-keys.sh`: operator script to list, rotate (for local dev), deactivate,
  and delete IAM access keys on `phylopic-www`, `phylopic-contribute`, and `phylopic-ses-sender`
  after Vercel OIDC rollout.

### Changed

- `README.md`: document retiring Vercel static keys; principals table notes Vercel uses OIDC.

## [1.1.1] - 2026-08-10

### Fixed

- `phylopic-ses-sender.json`: grant `ses:SendEmail` on identity `keesey@gmail.com` (SES IAM
  resource for Gmail plus-address senders), keeping `ses:FromAddress` limited to
  `keesey+phylopic@gmail.com`.

## [1.1.0] - 2026-08-10

### Changed

- `README.md`: note that Vercel can use `AWS_ROLE_ARN` (OIDC) instead of static access keys.

### Security

- Application code (via `@phylopic/utils-aws`) supports `AWS_ROLE_ARN` so Vercel deployments
  can drop static access keys after operator IAM role setup (documented in the private audit).

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
