# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `BACKUP.md`: inspect-first checklist, restore procedures (PITR, AWS Backup snapshot, single image, replica sync), and a quarterly drill for `phylopic-source` and `source-images.phylopic.org`.
- `backup/enable-backups.sh`: idempotent RDS PITR (14-day retention, deletion protection), AWS Backup vault/plan with weekly and monthly snapshots copied to `us-east-1`, S3 versioning plus CRR to `source-images-backup.phylopic.org`, lifecycle, SNS failure mail, and a source-image object-count alarm.

### Changed

### Deprecated

### Fixed

### Removed

### Security

## [1.2.2] - 2026-08-11

### Fixed

- `phylopic-editorial`: grant `s3:PutObjectTagging` (and `s3:GetObjectTagging`) on source-image
  keys so accepting a submission can `CopyObject` contributor tags from uploads.

## [1.2.1] - 2026-08-11

### Fixed

- `phylopic-editorial` and `phylopic-contribute`: grant `s3:PutObjectTagging` on submission trash keys so `CopyObject` can copy contributor tags when deleting submissions.

## [1.2.0] - 2026-08-10

### Added

- `phylopic-publish` IAM user policy for the publication pipeline (`yarn make`): S3 sync on `source-images`, `images`, and `entities` buckets; SSM build parameters; Lambda env on the two API functions; CloudFront invalidation.

### Changed

- `create-principals.sh` includes `phylopic-publish`.
- `README.md`: operator profile setup; `phylopic-editorial` is edit-only (publish uses `phylopic-publish`).

## [1.1.2] - 2026-08-10

### Added

- `retire-vercel-scoped-keys.sh`: operator script to list, rotate (for local dev), deactivate, and delete IAM access keys on `phylopic-www`, `phylopic-contribute`, and `phylopic-ses-sender` after Vercel OIDC rollout.

### Changed

- `README.md`: document retiring Vercel static keys; principals table notes Vercel uses OIDC.

## [1.1.1] - 2026-08-10

### Fixed

- `phylopic-ses-sender.json`: grant `ses:SendEmail` on sender identity (SES IAM resource for Gmail plus-address senders).

## [1.1.0] - 2026-08-10

### Changed

- `README.md`: note that Vercel can use `AWS_ROLE_ARN` (OIDC) instead of static access keys.

### Security

- Application code (via `@phylopic/utils-aws`) supports `AWS_ROLE_ARN` so Vercel deployments can drop static access keys after operator IAM role setup (documented in the private audit).

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
