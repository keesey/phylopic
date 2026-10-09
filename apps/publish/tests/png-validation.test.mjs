import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { after, before, test } from "node:test"
import { fileURLToPath } from "node:url"

const publish = fileURLToPath(new URL("../", import.meta.url))
const scratch = mkdtempSync(join(tmpdir(), "phylopic-png-test-"))
after(() => rmSync(scratch, { recursive: true, force: true }))

function magick(args) {
    const result = spawnSync("magick", args, { encoding: "utf8" })
    assert.equal(result.status, 0, result.stderr || String(result.error))
}

function inspect(file) {
    return spawnSync("zsh", ["-c", 'source ./inspect_png.sh; inspect_png "$1"', "inspect", file], {
        cwd: publish,
        encoding: "utf8",
    })
}

const fixtures = [
    { name: "transparent", color: "none", visible: false },
    { name: "hidden-color", color: "rgba(255,0,0,0)", visible: false },
    { name: "opaque-white", color: "white", visible: true },
    { name: "opaque-black", color: "black", visible: true },
    { name: "one-faint-pixel-8", bits: 8, alpha: "0.00392156862745098", visible: true },
    { name: "one-faint-pixel-16", bits: 16, alpha: "0.0000152590218967", visible: true },
]

before(() => {
    for (const fixture of fixtures) {
        const args = ["-size", "64x32", `xc:${fixture.color ?? "none"}`]
        if (fixture.bits) {
            args.push(
                "-fill",
                `rgba(0,0,0,${fixture.alpha})`,
                "-draw",
                "point 63,31",
                "-depth",
                String(fixture.bits),
                "-define",
                "png:color-type=6",
                "-define",
                `png:bit-depth=${fixture.bits}`,
            )
        }
        magick([...args, join(scratch, `${fixture.name}.png`)])
    }
})

for (const fixture of fixtures) {
    test(`${fixture.visible ? "accepts" : "rejects"} ${fixture.name}`, () => {
        const file = join(scratch, `${fixture.name}.png`)
        const result = inspect(file)
        assert.equal(result.status, fixture.visible ? 0 : 1, result.stderr)
        if (fixture.visible) {
            assert.equal(result.stdout.trim(), "64x32")
            assert.equal(result.stderr, "")
        } else {
            assert.equal(result.stdout, "")
            assert.ok(result.stderr.includes(file), result.stderr)
            assert.match(result.stderr, /transparent/i)
        }
    })
}

test("rejects the one-bit grayscale tRNS regression fixture from issue 88", () => {
    const file = join(publish, "tests", "fixtures", "barley-blank.png")
    const result = inspect(file)
    assert.equal(result.status, 1, result.stderr)
    assert.match(result.stderr, /transparent/i)
    assert.equal(result.stdout, "")
})

test("rejects corrupt PNGs with the affected filename", () => {
    const file = join(scratch, "corrupt.png")
    writeFileSync(file, "not a PNG")
    const result = inspect(file)
    assert.equal(result.status, 1, result.stderr)
    assert.ok(result.stderr.includes(file), result.stderr)
    assert.equal(result.stdout, "")
})

test("accepts paths containing spaces", () => {
    const file = join(scratch, "valid silhouette.png")
    copyFileSync(join(scratch, "opaque-black.png"), file)
    const result = inspect(file)
    assert.equal(result.status, 0, result.stderr)
    assert.equal(result.stdout.trim(), "64x32")
})

function processFixture({ preprocess = 0, vector = 0, raster = 0 }) {
    const dir = mkdtempSync(join(scratch, "process-"))
    copyFileSync(join(publish, "process.sh"), join(dir, "process.sh"))
    for (const [name, exitCode] of Object.entries({ preprocess, process_vector: vector, process_raster: raster })) {
        writeFileSync(join(dir, `${name}.sh`), `#!/bin/zsh\nsleep 0.02\nprint ${name} >> events\nexit ${exitCode}\n`, {
            mode: 0o755,
        })
    }
    writeFileSync(join(dir, "postprocess.sh"), "#!/bin/zsh\nprint postprocess >> events\n", { mode: 0o755 })
    const result = spawnSync("zsh", ["./process.sh"], { cwd: dir, encoding: "utf8" })
    return { result, events: readFileSync(join(dir, "events"), "utf8").trim().split("\n") }
}

for (const worker of ["vector", "raster"]) {
    test(`a ${worker} validation failure stops processing before scratch cleanup`, () => {
        const { result, events } = processFixture({ [worker]: 1 })
        assert.notEqual(result.status, 0)
        assert.ok(events.includes("process_vector"), "must wait for the vector worker")
        assert.ok(events.includes("process_raster"), "must wait for the raster worker")
        assert.ok(!events.includes("postprocess"), "must preserve scratch files on failure")
    })
}

test("a preprocessing failure prevents processing and cleanup", () => {
    const { result, events } = processFixture({ preprocess: 1 })
    assert.notEqual(result.status, 0)
    assert.deepEqual(events, ["preprocess"])
})

test("successful workers both finish before scratch cleanup", () => {
    const { result, events } = processFixture({})
    assert.equal(result.status, 0, result.stderr)
    assert.equal(events[0], "preprocess")
    assert.equal(events.at(-1), "postprocess")
    assert.ok(events.includes("process_vector"))
    assert.ok(events.includes("process_raster"))
})

// Seed rendered output so the real worker scripts can exercise inspection, moves,
// and background exit propagation without requiring Inkscape or potrace.
function runWorker(worker, blankSuffix) {
    const dir = mkdtempSync(join(scratch, `${worker}-`))
    const stage = join(dir, ".scratch", worker)
    const destination = join(dir, ".s3", "images.phylopic.org", "images", "00-test")
    mkdirSync(stage, { recursive: true })
    mkdirSync(destination, { recursive: true })
    copyFileSync(join(publish, "inspect_png.sh"), join(dir, "inspect_png.sh"))
    writeFileSync(join(stage, "00-test.vector.svg"), "<svg/>")
    const base = worker === "vector" ? "raster" : "source.raster"
    writeFileSync(join(stage, `00-test.${base}.bmp`), "stubbed potrace input")
    if (worker === "vector") {
        writeFileSync(join(stage, "00-test.source.svg"), "<svg/>")
    } else {
        copyFileSync(join(scratch, "opaque-black.png"), join(stage, "00-test.source.png"))
    }
    const suffixes = [
        `${base}.png`,
        `${base}.thumbnail.64.png`,
        worker === "vector" ? "raster.512.png" : "variant.512.png",
        worker === "vector" ? "raster.social.png" : "social.png",
    ]
    for (const suffix of suffixes) {
        copyFileSync(
            join(scratch, suffix === blankSuffix ? "transparent.png" : "opaque-black.png"),
            join(stage, `00-test.${suffix}`),
        )
    }
    return { result: spawnWorker(dir, worker), stage, destination }
}

function spawnWorker(dir, worker) {
    return spawnSync(
        "zsh",
        [
            "-c",
            `
            magick() {
                if [[ $1 == identify ]]; then command magick "$@"; else return 0; fi
            }
            inkscape() { print 64; }
            potrace() { return 0; }
            source "$1"
            `,
            "worker-test",
            join(publish, `process_${worker}.sh`),
        ],
        { cwd: dir, encoding: "utf8", timeout: 30000 },
    )
}

for (const [worker, suffix, folder] of [
    ["vector", "raster.512.png", "raster"],
    ["vector", "raster.thumbnail.64.png", "thumbnail"],
    ["raster", "variant.512.png", "raster"],
    ["raster", "source.raster.thumbnail.64.png", "thumbnail"],
]) {
    test(`${worker} worker rejects an empty ${folder} before moving it`, () => {
        const { result, stage, destination } = runWorker(worker, suffix)
        assert.equal(result.status, 1, result.stderr || String(result.error))
        assert.ok(result.stderr.includes(`Fully transparent PNG: .scratch/${worker}/00-test.${suffix}`))
        assert.ok(existsSync(join(stage, `00-test.${suffix}`)), "invalid PNG must remain available for diagnosis")
        if (folder === "thumbnail" || worker === "vector") {
            assert.ok(!existsSync(join(destination, folder, "64x32.png")))
        }
    })
}

for (const worker of ["vector", "raster"]) {
    test(`${worker} worker succeeds when there are no sources to process`, () => {
        const dir = mkdtempSync(join(scratch, `empty-${worker}-`))
        mkdirSync(join(dir, ".scratch", worker), { recursive: true })
        copyFileSync(join(publish, "inspect_png.sh"), join(dir, "inspect_png.sh"))
        const result = spawnWorker(dir, worker)
        assert.equal(result.status, 0, result.stderr || String(result.error))
        assert.equal(result.stderr, "")
    })

    test(`${worker} worker stages valid rasters and thumbnails using their dimensions`, () => {
        const { result, destination } = runWorker(worker)
        assert.equal(result.status, 0, result.stderr || String(result.error))
        for (const folder of ["raster", "thumbnail", "social"]) {
            assert.ok(existsSync(join(destination, folder, "64x32.png")), `missing ${folder}`)
        }
    })
}
