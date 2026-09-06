# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Precomputed S3 reads for unfiltered `GET /contributors`, `GET /nodes`, and `GET /images`.

### Changed

- Single-entity JSON is always read from S3.
- List pagination serves `{build}/lists/{name}/index.json` and `{page}.json` from S3 when there are no filters or embeds.

### Deprecated

### Fixed

- In offline mode, adding `/prod` to the path is no longer needed.

### Removed

- The `ENTITY_JSON_SOURCE` environment variable and runtime source switch.

### Security

## [2.14.2] - 2026-09-02

### Fixed

- `POST /collections` with `Content-Type: application/vnd.phylopic.v2+json` returned `400` after the HTTP API migration because API Gateway base64-encodes non-text request bodies. The handler now decodes the body when `isBase64Encoded` is set.
- API documentation did not include that `application/json` is also acceptable for `Content-Type` on `POST /collections`.

## [2.14.1] - 2026-08-29

### Fixed

- S3 resolve redirects merge request query parameters (such as `embed_primaryImage`) into the
  precomputed link `href`, matching Postgres resolve behavior.

## [2.14.0] - 2026-08-28

### Changed

- `GET /namespaces` reads precomputed `{build}/namespaces.json` from S3 when `ENTITY_JSON_SOURCE` is `s3` or `s3-fallback`, with Postgres fallback until the object exists for the current build.
- `GET /resolve/...` reads precomputed `{build}/resolve/{authority}/{namespace}/{objectID}.json` from S3 when `ENTITY_JSON_SOURCE` is `s3` or `s3-fallback`, with Postgres fallback until objects exist for the current build.

## [2.13.6] - 2026-08-19

### Changed

- Upgraded `@phylopic/utils-aws` to `1.1.3`.

## [2.13.5] - 2026-08-12

### Changed

- Upgraded `vitest` from `1.5.0` to `4.1.10`.
- Upgraded `@phylopic/utils-aws` to `1.1.2`; `@aws-sdk/client-s3` peer dependency now `^3.1093.0`.
- Upgraded `@phylopic/api-models` to `1.4.1`.
- Upgraded `@phylopic/utils` to `1.2.4`.

### Removed

- Unused `aws-lambda` dev dependency (legacy `aws-sdk` v2, `js-yaml` 3.x, and `xml2js` 0.4.x).

### Security

- Pin Swagger UI CDN assets with SRI and use HTTPS for API docs URLs.
- Upgraded `vite` to `5.4.21` (via `vitest`), fixing path traversal via trailing backslash on
  Windows when the Vite dev server is exposed to the network (CVE-2025-62522).
- Upgraded `@hapi/wreck` to `18.1.2` (via `serverless-offline`), fixing credential header leak
  on cross-port/cross-scheme redirects (CVE-2026-48022).

## [2.13.4] - 2026-08-11

### Fixed

- `POST /uploads` SVG sanitization uses `@phylopic/utils/svg/lite` (no jsdom), avoiding
  `ERR_REQUIRE_ESM` from `@exodus/bytes` in the uploader Lambda.

## [2.13.3] - 2026-08-11

### Fixed

- `POST /uploads` no longer crashes on Lambda init: keep `jsdom` / `isomorphic-dompurify` out of the
  bundled `uploader` artifact (Serverless `build.esbuild.external`) and load SVG sanitization on demand.
  Include `@aws-sdk/client-s3` in the deployment package for the externalized uploader bundle.

## [2.13.2] - 2026-08-11

### Fixed

- CORS preflight for cross-origin `POST /uploads`: route `OPTIONS /uploads` through the `dynamic` Lambda (same pattern as `OPTIONS /collections`), not the `uploader` Lambda.

## [2.13.1] - 2026-08-11

### Fixed

- CORS preflight for cross-origin `POST /uploads` (`OPTIONS /uploads` on the `uploader` Lambda, without the auth authorizer).

## [2.13.0] - 2026-08-11

### Changed

- Upgraded `@phylopic/api-models` to `1.4.0`.

### Removed

- `postResolveObjects` method (`POST /resolve/{authority}/{namespace}`).
- `Image._links["twitter:image"]` (use `http://ogp.me/ns#image` instead).

## [2.12.0] - 2026-08-11

### Changed

- Serve API documentation over HTTPS on `api-docs.phylopic.org`.

### Security

- Documentation site URLs and the API index `_links.documentation` href use `https://`.

## [2.11.5] - 2026-08-10

### Security

- Rate-limit unauthenticated `POST /collections` by source IP.
- Return generic messages for unexpected API errors instead of internal details.

## [2.11.4] - 2026-08-10

### Changed

- Replaced unmaintained `swagger-cli` with `@apidevtools/swagger-parser` for OpenAPI validation (compatible with js-yaml 4).

## [2.11.3] - 2026-08-10

### Changed

- List routes with `embed_items=true` release the Postgres client after the list query and before S3 embed fan-out, so connections are not held idle during embed work.
- `dynamic` Lambda `reservedConcurrency` capped at 50 to stay within RDS connection limits on `db.t3.micro`.

## [2.11.2] - 2026-08-09

### Security

- Upgraded `@phylopic/api-models` to `1.3.7`.
- Upgraded `@phylopic/utils` to `1.2.2`.
- Upgraded `@phylopic/utils-aws` to `1.0.7`.
- Upgraded `eslint-config-phylopic` to `1.0.6`.

## [2.11.1] - 2026-08-09

### Changed

- Upgraded `@phylopic/utils/svg` to `1.2.1`.

## [2.11.0] - 2026-08-09

### Changed

- Upgraded `@phylopic/utils` to `1.2.0`.

### Security

- SVG uploads are sanitized on ingest before storage (`POST /uploads`).

## [2.10.1] - 2026-08-09

### Changed

- Further OpenAPI alignment (Content-Type charset, Node link types, deprecated `twitter:image`).

## [2.10.0] - 2026-08-09

### Changed

- Folded `apps/api-docs` into this project. API documentation lives under `docs/` and is built from `package.json` version before deploy.
- `yarn deploy` now publishes the API and documentation in parallel.
- Corrected OpenAPI documentation to match the API implementation (`GET /namespaces` response shape, Node links, lineage parameters, resolve/upload responses, and error schema).

### Removed

- Separate `apps/api-docs` workspace (documentation is now part of `apps/api`).

## [2.9.5] - 2026-08-09

### Fixed

- Removed HTTP API automatic CORS configuration, which returned preflight (`OPTIONS`) responses without `Access-Control-*` headers through CloudFront. Preflight for `POST` routes is handled by the `dynamic` Lambda instead. Lambda CORS header values are now strings.

## [2.9.4] - 2026-08-09

### Changed

- Upgraded Node.js runtime to 24.

## [2.9.3] - 2026-08-09

### Changed

- `yarn deploy` now invalidates the API CloudFront distribution (`/*`) after `sls deploy`. Requires `API_CLOUDFRONT_DISTRIBUTION_ID` in `apps/api/.env` (same value as `apps/publish/.env`). Use `yarn invalidate-cache` on its own when needed.

### Fixed

- CORS for `POST /collections` (and other cross-origin POSTs): HTTP API now declares `POST` in `allowedMethods`, and Lambda CORS headers include `content-type`, `POST`, and `location` (for 303 redirects). `allow-credentials` is false so it is compatible with `allow-origin: *`. Automatic API Gateway preflight responses did not include CORS headers through CloudFront, so `OPTIONS` for `POST` routes is handled by the `dynamic` Lambda instead.

## [2.9.2] - 2026-08-09

### Fixed

- Restored Postgres connection pooling in `dynamic`.

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
