import { DATA_MEDIA_TYPE, type API, type ErrorResponse, type TitledLink } from "@phylopic/api-models"
import { addBuildToURL, joinPath, toSearchParams } from "./url.js"

export type FetchFn = typeof fetch

export class PhyloPicApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
        readonly errors?: ErrorResponse["errors"],
    ) {
        super(message)
        this.name = "PhyloPicApiError"
    }
}

export type PhyloPicClientOptions = {
    baseUrl?: string
    fetch?: FetchFn
    buildTtlMs?: number
}

const DEFAULT_BASE_URL = "https://api.phylopic.org"
const DEFAULT_BUILD_TTL_MS = 60_000

export class PhyloPicClient {
    readonly #baseUrl: string

    readonly #fetch: FetchFn

    readonly #buildTtlMs: number

    #build: number | undefined

    #buildFetchedAt = 0

    constructor(options: PhyloPicClientOptions = {}) {
        this.#baseUrl = (options.baseUrl ?? process.env.PHYLOPIC_API_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "")
        this.#fetch = options.fetch ?? fetch
        this.#buildTtlMs = options.buildTtlMs ?? DEFAULT_BUILD_TTL_MS
    }

    get baseUrl() {
        return this.#baseUrl
    }

    async getBuild(force = false): Promise<number> {
        const now = Date.now()
        if (!force && this.#build !== undefined && now - this.#buildFetchedAt < this.#buildTtlMs) {
            return this.#build
        }
        const index = await this.#fetchJson<API>("/", {})
        this.#build = index.build
        this.#buildFetchedAt = now
        return index.build
    }

    async getJson<T>(
        path: string,
        query: Readonly<Record<string, string | number | boolean | undefined>> = {},
    ): Promise<T> {
        const build = await this.getBuild()
        const url = joinPath(this.#baseUrl, path) + toSearchParams({ ...query, build })
        return await this.#fetchJson<T>(url, {}, build)
    }

    async getJsonAtUrl<T>(href: string): Promise<T> {
        const url = href.startsWith("http") ? href : joinPath(this.#baseUrl, href)
        const build = await this.getBuild()
        return await this.#fetchJson<T>(url, {}, build)
    }

    async resolveExternal(
        authority: string,
        namespace: string,
        objectIDs: readonly string[],
        embedPrimaryImage = true,
    ): Promise<{ link: TitledLink; node: unknown }> {
        const build = await this.getBuild()
        const path = `/resolve/${encodeURIComponent(authority)}/${encodeURIComponent(namespace)}`
        const query = {
            build,
            objectIDs: objectIDs.join(","),
            ...(embedPrimaryImage ? { embed_primaryImage: "true" as const } : {}),
        }
        const url = joinPath(this.#baseUrl, path) + toSearchParams(query)
        const response = await this.#fetch(url, {
            headers: { Accept: DATA_MEDIA_TYPE },
            redirect: "manual",
        })
        if (response.status === 404) {
            await this.#throwApiError(response)
        }
        if (response.status !== 308 && response.status !== 307) {
            throw new PhyloPicApiError(`Unexpected resolve status ${response.status}`, response.status)
        }
        const link = (await response.json()) as TitledLink
        const node = await this.getJsonAtUrl<unknown>(link.href)
        return { link, node }
    }

    async resolveExternalSingle(
        authority: string,
        namespace: string,
        objectID: string,
        embedPrimaryImage = true,
    ): Promise<{ link: TitledLink; node: unknown }> {
        const build = await this.getBuild()
        const path = `/resolve/${encodeURIComponent(authority)}/${encodeURIComponent(namespace)}/${encodeURIComponent(objectID)}`
        const query = {
            build,
            ...(embedPrimaryImage ? { embed_primaryImage: "true" as const } : {}),
        }
        const url = joinPath(this.#baseUrl, path) + toSearchParams(query)
        const response = await this.#fetch(url, {
            headers: { Accept: DATA_MEDIA_TYPE },
            redirect: "manual",
        })
        if (response.status === 404) {
            await this.#throwApiError(response)
        }
        if (response.status !== 308 && response.status !== 307) {
            throw new PhyloPicApiError(`Unexpected resolve status ${response.status}`, response.status)
        }
        const link = (await response.json()) as TitledLink
        const node = await this.getJsonAtUrl<unknown>(link.href)
        return { link, node }
    }

    async #fetchJson<T>(
        pathOrUrl: string,
        query: Readonly<Record<string, string | number | boolean | undefined>>,
        build?: number,
    ): Promise<T> {
        const isAbsolute = pathOrUrl.startsWith("http")
        let url = isAbsolute ? pathOrUrl : joinPath(this.#baseUrl, pathOrUrl)
        if (!isAbsolute && Object.keys(query).length > 0) {
            url += toSearchParams(query)
        }
        let response = await this.#fetch(url, { headers: { Accept: DATA_MEDIA_TYPE } })
        if ((response.status === 307 || response.status === 308) && build !== undefined) {
            const location = response.headers.get("location")
            if (location?.includes("build=") && !location.includes(`build=${build}`)) {
                const redirected = addBuildToURL(location, build)
                response = await this.#fetch(joinPath(this.#baseUrl, redirected), {
                    headers: { Accept: DATA_MEDIA_TYPE },
                })
            } else if (location) {
                response = await this.#fetch(joinPath(this.#baseUrl, location), {
                    headers: { Accept: DATA_MEDIA_TYPE },
                })
            }
        }
        if (!response.ok) {
            await this.#throwApiError(response)
        }
        return (await response.json()) as T
    }

    async #throwApiError(response: Response): Promise<never> {
        let message = response.statusText || `HTTP ${response.status}`
        try {
            const body = (await response.json()) as ErrorResponse
            if (body.errors?.length) {
                message = body.errors.map(error => error.userMessage ?? error.developerMessage).join("; ")
            }
        } catch {
            // ignore JSON parse errors
        }
        throw new PhyloPicApiError(message, response.status)
    }
}
