export type CurlOptions = {
    data?: string | object | null | boolean | number
    headers?: Readonly<Record<string, string>>
    location?: boolean
}
