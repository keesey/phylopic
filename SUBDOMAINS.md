# Subdomains

This documents the subdomains of `phylopic.org` used by _PhyloPic_.

The apex domain, `phylopic.org`, redirects to `https://www.phylopic.org`, the canonical URL for the Home Page.

## `api.phylopic.org`

The public API, served from Amazon API Gateway and delivered via Amazon Cloudfront.

## `api-docs.phylopic.org`

Documentation for the public API, statically hosted on [Amazon S3](./S3.md#api-docsphylopicorg) and delivered via Amazon CloudFront at `https://api-docs.phylopic.org`.

## `contribute.phylopic.org`

Contribution website, hosted by Vercel.

## `entities.phylopic.org`

Precomputed entity JSON for the public API, served from [Amazon S3](./S3.md#entitiesphylopicorg). Written during publish builds alongside the `phylopic-entities` database.

## `images.phylopic.org`

Image files for the main website, served from [Amazon S3](./S3.md#imagesphylopicorg) and delivered via Amazon Cloudfront.

## `uploads.phylopic.org`

Image files uploaded via the contribution website, served from [Amazon S3](./S3.md#uploadsphylopicorg) and delivered via Amazon Cloudfront.

## `www.phylopic.org`

The main website, hosted by Vercel.
