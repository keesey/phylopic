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
