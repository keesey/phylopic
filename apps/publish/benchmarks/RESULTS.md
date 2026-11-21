# PNG validation benchmark results

Measured on 2026-10-09: Apple M4 Max, macOS 15.6 (Darwin 24.6.0), arm64, Node 24.19.0,
zsh 5.9, ImageMagick 7.1.2-32 Q16-HDRI (no OpenMP in this build).
[Raw samples, fixture hashes, and environment](png-validation-results.json).

The benchmark uses the production helper. Each method has three warmups and 31 timed samples per PNG, with alternating
method order. Times include a zsh wrapper, command substitution, ImageMagick startup/decode, and result checks. Downloads
occur before measurement. These are local inspection timings, not an end-to-end publisher benchmark.
See [the method and reproduction command](../PNG-VALIDATION.md#benchmark).

## Measurements

| PNG               | Visible pixels? | Before median (ms) | After median (ms) | Added (ms) | Before / after p95 (ms) |
| ----------------- | --------------- | -----------------: | ----------------: | ---------: | ----------------------: |
| raster 1536x2048  | no              |             31.655 |            39.503 |      7.849 |         34.771 / 42.255 |
| raster 1024x1365  | no              |             18.398 |            22.953 |      4.556 |         20.108 / 24.989 |
| raster 692x1536   | yes             |             11.526 |            13.748 |      2.222 |         13.722 / 14.927 |
| raster 461x1024   | yes             |              9.553 |            10.492 |      0.938 |         10.836 / 12.239 |
| raster 512x683    | no              |             10.713 |            12.479 |      1.766 |         13.152 / 14.063 |
| raster 231x512    | yes             |              9.949 |            11.058 |      1.109 |         11.702 / 16.365 |
| thumbnail 192x192 | yes             |              7.666 |             8.556 |      0.890 |          8.995 / 10.180 |
| thumbnail 128x128 | yes             |              7.225 |             8.038 |      0.813 |           8.441 / 9.301 |
| thumbnail 64x64   | yes             |              7.030 |             7.611 |      0.582 |          8.863 / 10.134 |

“Added” is the difference between method medians, not a measured production latency or a confidence bound.
p95 uses the nearest-rank sample. Local scheduling and cache state affect these small timings.

## Extrapolated publishing cost

The current vector recipe emits three rasters and three thumbnails per source. The barley profile uses the visible
692×1536, 461×1024, and 231×512 variants plus the 192, 128, and 64 pixel thumbnails:
**6.554 ms extra per regenerated source** from the sum of those six per-file median differences.
It is one concrete workload, not a representative sample of the whole catalog.

The larger-image scenario applies the largest observed median difference, **7.849 ms per PNG**
(the 1536×2048 blank fixture), to every output. This is a sensitivity calculation, not a worst-case bound or a prediction
that thumbnails cost as much as large rasters. A real publish stops when an empty PNG is detected.

| New/regenerated sources | Checked PNGs | Added time: barley SVG profile | Added time: larger-image scenario | Illustrative cost at $1/runner-hour (profile / larger) |
| ----------------------: | -----------: | -----------------------------: | --------------------------------: | -----------------------------------------------------: |
|                       0 |            0 |                         0.00 s |                            0.00 s |                                    $0.00000 / $0.00000 |
|                     100 |          600 |                         0.66 s |                            4.71 s |                                    $0.00018 / $0.00131 |
|                   1,000 |        6,000 |                         6.55 s |                           47.09 s |                                    $0.00182 / $0.01308 |
|                  10,000 |       60,000 |                        65.54 s |                          470.92 s |                                    $0.01820 / $0.13081 |

Formula: additional seconds = checked PNG count × added milliseconds per PNG ÷ 1,000.
For the barley profile, use source count × 6.554 ÷ 1,000.
Both columns sum sequential inspection time; worker overlap may reduce wall-clock impact, and production hardware,
image dimensions, PNG encoding, resource limits, or contention may increase it.
Raster sources can produce a different number of variants; count their actual generated rasters and thumbnails.

The dollar column assumes an illustrative $1 per runner-hour, not a quoted hosting price.
At a real rate of R dollars/hour, incremental time-based cost = added seconds ÷ 3,600 × R, before billing minimums.
A fixed-price publishing machine may have no additional invoice cost. There are no additional upload/API requests
or production dependencies. No-change builds perform no additional pixel checks, though worker setup still runs.

Existing cached files are not part of these estimates: they are not rescanned. Regenerating existing assets incurs
rendering and publication costs beyond the small validation increment measured here.
