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

## [1.0.0] - 2026-09-01

### Added

- Semiannual fundraiser campaign helpers (May and October, UTC): campaign ids, active/preview
  windows, goal carry-forward from the previous campaign, and selectable campaigns for editing.
- Upstash Redis campaign store (`goal`, `donation`, `manual` counters; IPN transaction dedup set).
- Separate read and write KV clients (`KV_REST_API_READ_ONLY_TOKEN` or `KV_REST_API_TOKEN` for
  reads; `KV_REST_API_TOKEN` for writes).
- PayPal IPN field parsing, verification against `ipnpb.paypal.com`, and completed-donation checks.
- Public fundraiser status and editor state types.
- Vitest coverage for campaign scheduling and KV configuration helpers.
