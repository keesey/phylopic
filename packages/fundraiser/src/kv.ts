import { createClient, type VercelKV } from "@vercel/kv"

let readClient: VercelKV | null = null
let writeClient: VercelKV | null = null

export const isKvReadConfigured = (): boolean =>
    Boolean(process.env.KV_REST_API_URL && (process.env.KV_REST_API_READ_ONLY_TOKEN || process.env.KV_REST_API_TOKEN))

export const isKvWriteConfigured = (): boolean => Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)

/** @deprecated Prefer {@link isKvReadConfigured} or {@link isKvWriteConfigured}. */
export const isKvConfigured = isKvWriteConfigured

export const getReadKv = (): VercelKV => {
    if (!readClient) {
        const url = process.env.KV_REST_API_URL
        const token = process.env.KV_REST_API_READ_ONLY_TOKEN || process.env.KV_REST_API_TOKEN
        if (!url || !token) {
            throw new Error("Fundraiser read storage is not configured.")
        }
        readClient = createClient({ url, token })
    }
    return readClient
}

export const getWriteKv = (): VercelKV => {
    if (!writeClient) {
        const url = process.env.KV_REST_API_URL
        const token = process.env.KV_REST_API_TOKEN
        if (!url || !token) {
            throw new Error("Fundraiser write storage is not configured.")
        }
        writeClient = createClient({ url, token })
    }
    return writeClient
}
