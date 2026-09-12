import { timingSafeEqual } from "crypto"
import { NextApiHandler } from "next"

export const ALLOWLISTED_REVALIDATION_PATHS = [
    "/",
    "/articles",
    "/contributors",
    "/images",
    "/nodes",
    "/search",
    "/thanks",
] as const

type RevalidateBody = Readonly<{
    paths?: readonly string[]
}>

const configuredToken = process.env.REVALIDATE_TOKEN

const authorize = (authorization: string | undefined): boolean => {
    if (!configuredToken || typeof authorization !== "string" || !authorization.startsWith("Bearer ")) {
        return false
    }
    const provided = authorization.slice("Bearer ".length)
    const providedBytes = new TextEncoder().encode(provided)
    const configuredBytes = new TextEncoder().encode(configuredToken)
    if (providedBytes.length !== configuredBytes.length) {
        return false
    }
    return timingSafeEqual(providedBytes, configuredBytes)
}

const isAllowlistedPath = (path: string): path is (typeof ALLOWLISTED_REVALIDATION_PATHS)[number] =>
    (ALLOWLISTED_REVALIDATION_PATHS as readonly string[]).includes(path)

const normalizePath = (path: string): string | null => {
    if (!path.startsWith("/") || path.startsWith("//") || path.includes("..")) {
        return null
    }
    return path
}

const index: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST")
        return res.status(405).json({ message: "Method not allowed." })
    }
    if (!authorize(req.headers.authorization)) {
        return res.status(401).json({ message: "Invalid authorization token." })
    }
    const body = (typeof req.body === "object" && req.body !== null ? req.body : {}) as RevalidateBody
    const requestedPaths =
        Array.isArray(body.paths) && body.paths.length
            ? body.paths.map(path => (typeof path === "string" ? normalizePath(path) : null))
            : [...ALLOWLISTED_REVALIDATION_PATHS]
    if (requestedPaths.some(path => path === null)) {
        return res.status(400).json({ message: "Invalid path." })
    }
    const paths = requestedPaths as string[]
    const disallowed = paths.filter(path => !isAllowlistedPath(path))
    if (disallowed.length) {
        return res.status(400).json({ message: "Path is not allowlisted.", paths: disallowed })
    }
    try {
        const results = await Promise.allSettled(paths.map(path => res.revalidate(path)))
        let revalidated = true
        for (const result of results) {
            if (result.status === "rejected") {
                console.error(result.reason)
                revalidated = false
            }
        }
        return res.json({ paths, revalidated })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: String(err) })
    }
}
export default index
