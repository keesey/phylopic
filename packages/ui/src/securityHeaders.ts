interface SecurityHeader {
    readonly key: string
    readonly value: string
}

interface SecurityHeaderRoute {
    readonly source: string
    readonly headers: readonly SecurityHeader[]
}

export interface SecurityHeaderOptions {
    readonly development?: boolean
}

const createConnectSrc = (development?: boolean) =>
    development
        ? "connect-src 'self' https: ws://127.0.0.1:* ws://localhost:* http://127.0.0.1:* http://localhost:*"
        : "connect-src 'self' https:"

const createBaseSecurityHeaders = (development?: boolean): readonly SecurityHeader[] => [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    {
        key: "Content-Security-Policy",
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https:",
            "font-src 'self' data: https://fonts.gstatic.com",
            createConnectSrc(development),
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join("; "),
    },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
]

export const createSecurityHeaderRoutes = (options: SecurityHeaderOptions = {}): readonly SecurityHeaderRoute[] => [
    {
        source: "/:path*",
        headers: [...createBaseSecurityHeaders(options.development)],
    },
]
