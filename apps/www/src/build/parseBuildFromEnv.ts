const parseBuildFromEnv = (): number => {
    const raw = process.env.NEXT_PUBLIC_BUILD
    if (!raw) {
        throw new Error("NEXT_PUBLIC_BUILD is required")
    }
    const build = Number.parseInt(raw, 10)
    if (Number.isNaN(build)) {
        throw new Error(`NEXT_PUBLIC_BUILD must be a number, got: ${raw}`)
    }
    return build
}

const BUILD = parseBuildFromEnv()

export default BUILD
