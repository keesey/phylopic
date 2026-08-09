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

## [2.9.1] - 2026-08-08

### Changed

- CloudWatch log groups for all Lambda functions now retain logs for 14 days (`logRetentionInDays` in `serverless.yml`).
- Lambda platform `START` / `END` / `REPORT` lines are suppressed on successful invocations (`systemLogLevel: WARN`); application warnings and errors still log.

## [2.9.0] - 2026-08-08

### Changed

- Single-entity JSON reads (`GET /contributors/{uuid}`, `/images/{uuid}`, `/nodes/{uuid}`, and embeds) now load from S3 (`entities.phylopic.org`) when `ENTITY_JSON_SOURCE` is `s3` or `s3-fallback`. (List, search, resolve, and collection endpoints still use Postgres.)

## [2.8.1] - 2026-08-08

### Changed

- Reduced `dynamic` and `uploader` Lambda memory from 1024 MB to 512 MB.

## [2.8.0] - 2026-08-08

### Changed

- Migrated from API Gateway REST API to HTTP API (v2) in `serverless.yml`, using payload format 1.0 so existing Lambda handlers are unchanged.
- HTTP API reserves `/ping` for its own health check; the Lambda route is now `/_ping`, with CloudFront rewriting public `/ping` requests to that path.

## [2.7.7] - 2026-08-07

### Removed

- `src/auth/jwt/decodeJWT.ts`, which no longer had any callers.

### Security

- The upload endpoint now takes the contributor's identity from the request authorizer, via `event.requestContext.authorizer.uuid`, instead of decoding the `Authorization` header itself.

## [2.7.6] - 2026-08-07

### Security

- Removed key value from log.

## [2.7.5] - 2026-07-26

### Fixed

- Moved `serverless-offline`'s internal Lambda endpoint to port 3103 in the `dev` script, so it no longer shadows the `contribute` app on port 3002.

## [2.7.4] - 2026-07-22

### Changed

- Minor upgrades for `pg`, `serverless`, `serverless-offline`, `ts-loader`, and `webpack`.

### Security

- Minor upgrade for AWS clients, fixing `fast-xml-parser` vulnerabilities.
- Patch upgrade for `jsonwebtoken`.

## [2.7.3] - 2026-03-17

### Added

- Charset to `Content-Type` headers.

## [2.7.2] - 2026-01-05

### Changed

- Major upgrade for Serverless.
- Minor upgrade for AWS clients.
- Upgraded Node.js runtime to 22.

## [2.7.1] - 2025-01-03

### Added

- Image JSON includes an optional `unlisted` property.

## [2.7.0] - 2025-01-02

### Changed

- Filtering out unlisted images and contributors from lists.

## [2.6.3] - 2024-12-03

### Changed

- Updated architecture to AWS Graviton2 processor (`arm64`).

## [2.6.2] - 2024-11-04

### Changed

- Upgraded AWS SDKs.

## [2.6.1] - 2024-04-13

### Changed

- Upgrades:
    - Node.js 20.
    - All dependencies.
- Switched to `vitest` from `mocha`.

## [2.6.0] - 2023-05-18

### Changed

- `getNodes` now returns `308` responses for UUIDs that have been sunk as synonyms of other nodes.

## [2.5.1] - 2023-05-14

### Changed

- Upgrades:
    - Node.js 18.
    - TypeScript 5.0.4.

## [2.5.0] - 2023-05-03

### Changed

- `postResolveObjects` returns a permanent redirect to `getResolveObjects`.
- `getResolveObjects` does not include `POST` as an allowed method.

### Fixed

- Validations were always of type `BAD_REQUEST_BODY` even when the field was in the parameters.

### Security

## [2.4.1] - 2023-04-30

### Fixed

- `getResolveObjects` was not forwarding when `build` was omitted.

## [2.4.0] - 2023-04-25

### Added

- `getResolveObjects` method.

### Deprecated

- `postResolveObjects` method.

## [2.3.2] - 2023-04-01

### Fixed

- API version number in response.

## [2.3.1] - 2023-03-24

### Fixed

- Sorting for images when filtering by modification times.

## [2.3.0] - 2023-03-24

### Added

- Filtering by dates (`created`, `modified`, `modifiedFile`) for images.

## [2.2.0] - 2023-03-21

### Changed

- Many links changed to `TitledLink`.

### Fixed

- Invalid `list` link in page response.

## [2.1.1] - 2023-02-12
