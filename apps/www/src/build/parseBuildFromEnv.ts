const parseBuildFromEnv = (): number | undefined => {
    const raw = process.env.NEXT_PUBLIC_BUILD
    if (!raw) {
        return undefined
    }
    const build = Number.parseInt(raw, 10)
    return Number.isNaN(build) ? undefined : build
}
export default parseBuildFromEnv
