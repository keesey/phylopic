import { DATA_MEDIA_TYPE } from "@phylopic/api-models"
import { describe, expect, it, vi } from "vitest"
import { PhyloPicApiError, PhyloPicClient } from "./PhyloPicClient.js"

const indexBody = {
    build: 42,
    title: "PhyloPic Application Programming Interface",
    version: "2.0.0",
    _links: { self: { href: "/?build=42" } },
}

describe("PhyloPicClient", () => {
    it("discovers and caches build from index", async () => {
        const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
            const url = String(input)
            if (url === "https://api.example/" || url === "https://api.example") {
                return new Response(JSON.stringify(indexBody), {
                    headers: { "content-type": DATA_MEDIA_TYPE },
                    status: 200,
                })
            }
            if (url.includes("/licenses?build=42")) {
                return new Response(JSON.stringify({ build: 42, items: [] }), {
                    headers: { "content-type": DATA_MEDIA_TYPE },
                    status: 200,
                })
            }
            throw new Error(`Unexpected fetch: ${url}`)
        })

        const client = new PhyloPicClient({ baseUrl: "https://api.example", fetch: fetchMock })
        const licenses = await client.getJson("/licenses", {})
        expect(licenses).toEqual({ build: 42, items: [] })
        expect(fetchMock).toHaveBeenCalledTimes(2)
        await client.getJson("/licenses", {})
        expect(fetchMock).toHaveBeenCalledTimes(3)
    })

    it("parses resolve 308 and fetches node", async () => {
        const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = String(input)
            if (url === "https://api.example/") {
                return new Response(JSON.stringify(indexBody), { status: 200 })
            }
            if (url.includes("/resolve/example.org/taxonomy?") && init?.redirect === "manual") {
                return new Response(JSON.stringify({ href: "/nodes/abc?build=42", title: "Example" }), {
                    headers: { location: "/nodes/abc?build=42" },
                    status: 308,
                })
            }
            if (url.includes("/nodes/abc?build=42")) {
                return new Response(JSON.stringify({ build: 42, uuid: "abc" }), { status: 200 })
            }
            throw new Error(`Unexpected fetch: ${url}`)
        })

        const client = new PhyloPicClient({ baseUrl: "https://api.example", fetch: fetchMock })
        const resolved = await client.resolveExternal("example.org", "taxonomy", ["1", "2"])
        expect(resolved.link.title).toBe("Example")
        expect(resolved.node).toEqual({ build: 42, uuid: "abc" })
    })

    it("creates a collection from POST 303", async () => {
        const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = String(input)
            if (url === "https://api.example/") {
                return new Response(JSON.stringify(indexBody), { status: 200 })
            }
            if (url.includes("/collections?build=42") && init?.method === "POST") {
                return new Response(JSON.stringify({ href: "/collections/abc-def?build=42" }), {
                    headers: { "content-type": DATA_MEDIA_TYPE },
                    status: 303,
                })
            }
            throw new Error(`Unexpected fetch: ${url}`)
        })
        const client = new PhyloPicClient({ baseUrl: "https://api.example", fetch: fetchMock })
        const created = await client.createCollection(["060f03a9-fafd-4d08-81d1-b8f82080573f"])
        expect(created.collectionUuid).toBe("abc-def")
        expect(created.href).toContain("/collections/abc-def")
    })

    it("mints a collection permalink from www", async () => {
        const hash = "a".repeat(64)
        const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
            const url = String(input)
            if (url.includes("/api/permalinks/collections/")) {
                return new Response(JSON.stringify(hash), {
                    headers: { "content-type": "application/json" },
                    status: 200,
                })
            }
            throw new Error(`Unexpected fetch: ${url}`)
        })
        const client = new PhyloPicClient({
            baseUrl: "https://api.example",
            fetch: fetchMock,
            wwwOrigin: "https://www.example.org",
        })
        const permalink = await client.createCollectionPermalink("abc-def")
        expect(permalink.hash).toBe(hash)
        expect(permalink.permalinkUrl).toBe(`https://www.example.org/permalinks/${hash}`)
    })

    it("throws PhyloPicApiError on 404", async () => {
        const fetchMock = vi.fn(async () => {
            return new Response(JSON.stringify({ build: 42, errors: [{ userMessage: "Not found." }] }), {
                status: 404,
            })
        })
        const client = new PhyloPicClient({ baseUrl: "https://api.example", fetch: fetchMock })
        await expect(client.getBuild()).rejects.toBeInstanceOf(PhyloPicApiError)
    })
})
