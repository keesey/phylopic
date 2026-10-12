# PNG validation before publishing

The PNGs reported in [issue 88](https://github.com/keesey/phylopic/issues/88) decode successfully but have no visible pixels.
`inspect_png.sh` rejects fully transparent rasters and thumbnails as workers move newly generated files into the local image mirror.

The helper replaces the existing dimensions lookup with:

```sh
magick identify -regard-warnings -alpha set -channel A -format '%wx%h %[max]\n' "$file"
```

ImageMagick decodes the PNG and computes the maximum alpha value using its native range reduction.
A maximum of zero means every pixel is transparent. Any positive value passes, including a single pixel with the smallest
nonzero 8-bit or 16-bit alpha. `-alpha set` handles PNG transparency chunks and treats images without alpha as opaque.
The helper also rejects decoder errors, warnings, and unexpected inspection output. It returns the dimensions for the destination filename.

The reduction visits every pixel: O(width × height). It shares the existing dimensions inspection process and decoded image.
There is no extra ImageMagick invocation, extracted alpha bitmap, network call, or production dependency.
This checks transparency, not the correctness of a silhouette: an opaque white image passes.
Social previews retain their existing dimensions lookup because their background makes an alpha check uninformative.

## Failures and existing assets

Both image workers preserve a PNG validation failure from their background move loops.
`process.sh` waits for both workers and exits unsuccessfully before scratch cleanup.
The existing `yarn make` command's `&&` chain then stops before metadata insertion and image upload.
Diagnostics in `process-error.log` identify the affected PNG, which remains in `.scratch`.

Other files may already have moved into the local `.s3` mirror when the check fails. Inspect the error and scratch PNG before
retrying. Restore the mirror with the normal `yarn download` step before rerunning processing; do not upload a partially
processed mirror or skip directly to `yarn make:data`. This change is not a general audit of every existing renderer or move error.

Unchanged cached images are not rescanned, so a build with no new or regenerated images performs no new pixel checks.
This guard does not repair already published blank variants or establish what originally produced them.
For a known affected image, an operator can download the current mirrors, move that UUID's **local processed-image directory**
out of `.s3/images.phylopic.org/images/` to a backup location, then run `yarn process` to force regeneration from the source.
Review the regenerated files and resulting metadata before continuing the normal publication procedure.
Keep the source under `.s3/source-images.phylopic.org/images/` intact. CDN-cached variants may require invalidation after repair.

## Tests

From `apps/publish`, with Node 24, zsh, and ImageMagick 7.1+ installed:

```sh
yarn test:png
```

Tests cover the real one-bit grayscale `tRNS` regression PNG, transparent color data, opaque images, corrupt files,
one faint pixel at both bit depths, dimension-based output names, and failure propagation through both worker scripts
and `process.sh`. Worker integration tests seed rendered output and stub rendering commands; ImageMagick inspection,
file moves, and background waits run normally. They require no network, Inkscape, potrace, or AWS credentials.

## Benchmark

Run the benchmark manually, outside publication:

```sh
node benchmarks/png-validation.mjs --rounds 31 --output /tmp/png-validation.json
```

It downloads this image's six public raster variants and three thumbnails before timing. Public assets may change after
repair; if expected dimensions or visibility change, the script fails rather than silently measuring different behavior.
Each case gets three warmups per method and 31 measurements with alternating method order. Both paths include zsh startup,
command substitution, ImageMagick startup, and PNG decoding. The proposed path runs the actual helper, including its parsing
and diagnostics. The baseline runs the current `%[fx:w]x%[fx:h]` lookup. Downloads, rendering, moving, and upload are excluded.

See [the recorded measurements and publishing-cost estimates](benchmarks/RESULTS.md).
