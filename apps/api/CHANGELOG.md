# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

-   `postResolveObjects` returns a permanent redirect to `getResolveObjects`.
-   `getResolveObjects` does not include `POST` as an allowed method.

### Deprecated

### Fixed

-   Validations were always of type `BAD_REQUEST_BODY` even when the field was in the parameters.

### Removed

### Security

## [2.4.1] - 2023-04-30

### Fixed

-   `getResolveObjects` was not forwarding when `build` was omitted.

## [2.4.0] - 2023-04-25

### Added

-   `getResolveObjects` method.

### Deprecated

-   `postResolveObjects` method.

## [2.3.2] - 2023-04-01

### Fixed

-   API version number in response.

## [2.3.1] - 2023-03-24

### Fixed

-   Sorting for images when filtering by modification times.

## [2.3.0] - 2023-03-24

### Added

-   Filtering by dates (`created`, `modified`, `modifiedFile`) for images.

## [2.2.0] - 2023-03-21

### Changed

-   Many links changed to `TitledLink`.

### Fixed

-   Invalid `list` link in page response.

## [2.1.1] - 2023-02-12
