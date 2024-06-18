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

## [2.12.1] - 2024-06-18

### Fixed

-   Wrong separator was being used for attributions in some cases.

## [2.12.0] - 2024-06-15

### Changed

-   Revised collection attribution to include anonymous entries.

### Fixed

-   Image Page nav looked awkward when there were no buttons (_Pan-Biota_).

## [2.11.0] - 2024-04-13

### Changed

-   Upgrades:
    -   Node.js 20.
    -   All dependencies.
-   Switched from `mocha` to `vitest`.

### Removed

-   Link for `mocha` on Donations Page.

## [2.10.3] - 2024-04-13

### Fixed

-   Link to documentation for the _Paleobiology Database_ API.

## [2.10.2] - 2024-04-13

### Fixed

-   URL for documentation for the _Paleobiology Database_ API.

## [2.10.1] - 2024-04-13

### Changed

-   Replaced `training.paleobiodb.org` with `paleobiodb.org`.

## [2.10.0] - 2024-04-07

### Fixed

-   Safari focus issue for search input.

## [2.9.2] - 2024-04-05

### Added

-   Overriding age estimates for some more nodes.

### Changed

-   Showing "Recent" instead of "Recent – present".

## [2.9.1] - 2024-03-30

### Added

-   Predefined age for _Praeanthropus garhi_.

### Fixed

-   Predefined ages were only showing up in `dev` mode.

## [2.9.0] - 2024-03-30

### Added

-   Ages for Lineage Nodes, taken primarily from _Timetree of Life_ and _The Paleobiology Database_.

### Changed

-   Moved Lineage Pages to a subfolder of the full Node Page path.

## [2.8.2] - 2024-03-18

### Removed

-   Temporarily removed Pocket Phylogenies section on Home Page to decrease bandwidth. (Will move images to alternate host and reinstate section later.)

## [2.8.1] - 2024-02-17

### Security

-   Protecting API routes from external domains.

## [2.8.0] - 2024-02-17

### Added

-   Support for `phylopic/nodes` identifiers to `/resolve/[authority]/[namespace]/[objectID]` path.

### Changed

-   Verbiage change for Search Input.

## [2.7.0] - 2024-01-24

### Added

-   Paragraph about sponsors on Image Collection Pages.

## [2.6.12] - 2024-01-04

### Changed

-   Description of `vectorFile` in API Recipes article.

## [2.6.11] - 2023-12-18

### Added

-   Source file in Image Downloads.

### Changed

-   Verbiage for vector file in Image Downloads.

## [2.6.10] - 2023-12-18

### Added

-   Missing mention of _GBIF_ API in API Recipes Article.

## [2.6.9] - 2023-08-30

### Fixed

-   Issue with updating build number.

## [2.6.8] - 2023-06-26

### Fixed

-   Updated two taxa in Quick Links.

## [2.6.7] - 2023-06-26 [YANKED]

### Fixed

-   Not allowing build #0.

## [2.6.6] - 2023-06-26 [YANKED]

### Fixed

-   No more flickering between build versions.

## [2.6.5] - 2023-06-04

### Changed

-   Replaced _Nephrozoa_ with _Bilateria_ in Quick Links.

## [2.6.4] - 2023-05-17

### Changed

-   Upgraded `@phylopic/utils-api` to `1.0.2`.

## [2.6.3] - 2023-05-17

### Changed

-   Revalidation endpoint takes `path` parameter.

### Fixed

-   Revalidation endpoint was not working properly.

## [2.6.2] - 2023-05-17

### Changed

-   Using Quick Links to generate list of initially-generated static Node Pages.

### Fixed

-   No longer potentially returning "Not Found" state for invalid fetch errors.

## [2.6.1] - 2023-05-14

### Changed

-   Upgrades:
    -   Node.js 18.
    -   TypeScript 5.0.4.

## [2.6.0] - 2023-05-02

### Added

-   GBIF to search capabilities.

### Changed

-   Search suggestions return full URL.
-   Search: node results appear in a separate container from resolutions.

## [2.5.3] - 2023-04-30

### Added

-   Section on _GBIF_ to _API Recipes_ article.

### Changed

-   Upgraded `next` to `13.3.1`.

## [2.5.2] - 2023-04-25

### Fixed

-   Invalid links for "snails" and "mollusks" in Quick Links.

## [2.5.1] - 2023-04-25

### Fixed

-   Width issue for search asides and results.

## [2.5.0] - 2023-04-25

### Changed

-   Image List View on Home Page to Image Rail.
-   Refactored styling for content width.
-   Hiding drag-and-drop prompt for Collections Drawer if device does not have hovering capabilities.
-   Using `GET /resolve/{authority}/{namespace}` instead of `POST /resolve/{authority}/{namespace}` for external resolvers.
-   Updated examples for resolving external objects in the _API Recipes_ article.

### Fixed

-   Scroll issue on mobile sizes.
-   Footer could be too wide for mobile sizes.
-   Quick links now have appropriate line breaks.

## [2.4.2] - 2023-04-20

### Fixed

-   Issue with _Open Tree of Life_ resolver.

## [2.4.1] - 2023-04-20

### Added

-   Redirect for `/sponsorship`.

### Changed

-   Refactored `useCollectionLicense()`.

## [2.4.0] - 2023-04-03

### Added

-   Quick Links to Home Page.

### Fixed

-   Width of Pocket Phylogenies header on Home Page.

## [2.3.0] - 2023-04-01

### Added

-   API Recipes Page.
-   Custom event tracking.
-   "Buy Me a Coffee" link on Home Page.

### Changed

-   Always showing _Pan-Biota_ link in Node Page breadcrumbs.

### Fixed

-   Direct links (including slug) for entities in several places.
-   Canonical URL for Donate: Cancel Page.
-   Display error on Nodes Page.

### Removed

-   "Taxonomic Groups" link from Node Page breadcrumbs.

## [2.2.1] - 2023-03-27

### Added

-   Loader to Collection Pages.

### Changed

-   Pocket Phylogenies take up the full screen width.

### Fixed

-   Collection Pages were displaying inaccurate information before data loaded.

## [2.2.0] - 2023-03-26

### Added

-   SEO improvements (taxonomic names in body, keywords, revised titles and descriptions, etc.).
-   Loaders on Lineage Pages.

## [2.1.2] - 2023-03-24

### Added

-   Cache-buster based on modification date for image file views.

## [2.1.1] - 2023-03-21

### Fixed

-   Updated paths for revalidation.

## [2.1.0] - 2023-03-21

### Changed

-   Added slugs to Contributor, Image, and Node Page URLs.
-   Simplified silhouette `alt` descriptions.

### Fixed

-   Wrapped all dynamically-loaded components in `<Suspense>`.

## [2.0.10] - 2023-03-19

### Changed

-   Removed schema from some outbound `https` links and external image links.
-   Updated link for API Docs.
-   Replaced `/donate` links with direct URL.
-   Updated `rel` attribute for links.

### Removed

-   Unused page for `/donate`.

## [2.0.9] - 2023-03-13

### Changed

-   Drastically reducing SWR fallback payload for Lineage Pages.

## [2.0.8] - 2023-03-10

### Fixed

-   The _Open Tree of Life_ resolver was not including the search result in the lineage list.

## [2.0.7] - 2023-03-06

### Added

-   More properties to `ImageObject` metadata.

### Removed

-   No longer setting `document.domain`.

## [2.0.6] - 2023-02-29

### Added

-   Blur image and `sizes` attribute for Pocket Phylogenies.

### Changed

-   Not optimizing social media icons in footers.
-   Not including `build` query in silhouette image URLs.
-   Made `alt` text for the backs of Pocket Phylogenies more descriptive.

### Fixed

-   Using more widely-accepted ARIA attribute (`aria-describedby`) for search input description.

## [2.0.5] - 2023-02-21

### Added

-   Redirect for `public/social/1200x1200.png`.

### Removed

-   `public/social/1200x1200.png`

## [2.0.4] - 2023-02-18

### Changed

-   Serving all social media images from `images.phylopic.org`.

### Deprecated

-   `public/social/1200x1200.png`

## [2.0.3] - 2023-02-13

### Added

-   Extra attributes to searchbar form.

## [2.0.2] - 2023-02-13

### Added

-   Vercel analytics.

## [2.0.1] - 2023-02-13

### Changed

-   Removed `lazyOnLoad` strategy for Google Measurement script.

## [2.0.0] - 2023-02-12
