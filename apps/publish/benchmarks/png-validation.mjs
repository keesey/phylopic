// Run from apps/publish: node benchmarks/png-validation.mjs --rounds 31 --output /tmp/png-validation.json
// Downloads public fixtures before timing; never runs publishing or uses credentials.
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { cpus, platform, release, tmpdir } from "node:os"
import { join } from "node:path"
import { performance } from "node:perf_hooks"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"

const { values } = parseArgs({ options: { rounds: { type: "string", default: "31" }, output: { type: "string" } } })
const rounds = Number(values.rounds)
assert.ok(Number.isInteger(rounds) && rounds >= 5, "--rounds must be an integer >= 5")
assert.ok(values.output, "Provide --output for raw samples and environment details")
const publish = fileURLToPath(new URL("../", import.meta.url))
const scratch = mkdtempSync(join(tmpdir(), "phylopic-png-benchmark-"))
const uuid = "c9d31948-819e-401a-abe5-8a4268421b96"
const cases = [
    ["raster", "1536x2048", false],
    ["raster", "1024x1365", false],
    ["raster", "692x1536", true],
    ["raster", "461x1024", true],
    ["raster", "512x683", false],
    ["raster", "231x512", true],
    ["thumbnail", "192x192", true],
    ["thumbnail", "128x128", true],
    ["thumbnail", "64x64", true],
]

function run(command, args, expectedStatus = 0) {
    const result = spawnSync(command, args, { cwd: publish, encoding: "utf8", timeout: 30000 })
    assert.equal(result.status, expectedStatus, result.stderr || String(result.error))
    return result.stdout.trim()
}

const scripts = {
    baseline: 'size=$(magick identify -format "%[fx:w]x%[fx:h]" "$1") || exit 1; print -r -- "$size"',
    proposed: 'source ./inspect_png.sh; size=$(inspect_png "$1") || exit 1; print -r -- "$size"',
}

function inspect(method, file, size, visible) {
    const expectedStatus = method === "proposed" && !visible ? 1 : 0
    const output = run("zsh", ["-f", "-c", scripts[method], "benchmark", file], expectedStatus)
    assert.equal(output, expectedStatus === 0 ? size : "")
}

function statistics(samples) {
    const sorted = [...samples].sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)
    return {
        median_ms: sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2,
        p95_ms: sorted[Math.ceil(sorted.length * 0.95) - 1],
        samples_ms: samples,
    }
}

const report = {
    date_utc: new Date().toISOString(),
    platform: `${platform()} ${release()} ${process.arch}`,
    cpu: cpus()[0]?.model,
    node: process.version,
    imagemagick: run("magick", ["-version"]),
    zsh: run("zsh", ["--version"]),
    rounds,
    scope: "Warm local files; includes zsh, command substitution, ImageMagick startup/decode and validation. No network in timings. Alternating method order. No rendering, upload or end-to-end publish timing.",
    fixtures: [],
}

try {
    // Fetch everything before measurement. Verify exit status and dimensions in
    // every sample so an inspection failure cannot appear as a performance win.
    for (const [kind, size, visible] of cases) {
        const url = `https://images.phylopic.org/images/${uuid}/${kind}/${size}.png`
        const response = await fetch(url, { signal: AbortSignal.timeout(30000) })
        assert.ok(response.ok, `${response.status}: ${url}`)
        const bytes = Buffer.from(await response.arrayBuffer())
        const file = join(scratch, `${kind}-${size}.png`)
        writeFileSync(file, bytes)
        report.fixtures.push({
            kind,
            size,
            visible,
            url,
            bytes: bytes.length,
            sha256: createHash("sha256").update(bytes).digest("hex"),
        })
    }
    for (const fixture of report.fixtures) {
        const { kind, size, visible } = fixture
        const file = join(scratch, `${kind}-${size}.png`)
        const samples = { baseline: [], proposed: [] }
        for (let warmup = 0; warmup < 3; warmup++) {
            for (const method of Object.keys(scripts)) inspect(method, file, size, visible)
        }
        for (let round = 0; round < rounds; round++) {
            const methods = round % 2 ? ["proposed", "baseline"] : ["baseline", "proposed"]
            for (const method of methods) {
                const start = performance.now()
                inspect(method, file, size, visible)
                samples[method].push(performance.now() - start)
            }
        }
        fixture.baseline = statistics(samples.baseline)
        fixture.proposed = statistics(samples.proposed)
        fixture.added_ms = fixture.proposed.median_ms - fixture.baseline.median_ms
    }
    writeFileSync(values.output, `${JSON.stringify(report, null, 2)}\n`)
    console.log("| PNG | Visible | Before median (ms) | After median (ms) | Added (ms) | Before / after p95 (ms) |")
    console.log("| --- | --- | ---: | ---: | ---: | ---: |")
    for (const row of report.fixtures) {
        const f = value => value.toFixed(3)
        console.log(
            `| ${row.kind} ${row.size} | ${row.visible ? "yes" : "no"} | ${f(row.baseline.median_ms)} | ${f(row.proposed.median_ms)} | ${f(row.added_ms)} | ${f(row.baseline.p95_ms)} / ${f(row.proposed.p95_ms)} |`,
        )
    }
    // Current SVG recipe produces 3 rasters and 3 thumbnails per source. Use
    // the visible barley variants for that profile; the three old blank sizes
    // are useful regression examples but are not six outputs of that recipe.
    const svgProfile = report.fixtures.filter(row => row.visible)
    const addedPerSource = svgProfile.reduce((sum, row) => sum + row.added_ms, 0)
    const largestObserved = Math.max(...report.fixtures.map(row => row.added_ms))
    console.log(
        "\n| New/regenerated source images | Checked PNGs (6/source) | Added time: barley SVG profile (s) | Added time: all PNGs at largest observed delta (s) |",
    )
    console.log("| ---: | ---: | ---: | ---: |")
    for (const count of [0, 100, 1000, 10000]) {
        console.log(
            `| ${count.toLocaleString("en-US")} | ${(count * 6).toLocaleString("en-US")} | ${((count * addedPerSource) / 1000).toFixed(2)} | ${((count * 6 * largestObserved) / 1000).toFixed(2)} |`,
        )
    }
} finally {
    rmSync(scratch, { recursive: true, force: true })
}
