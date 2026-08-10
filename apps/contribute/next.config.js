const path = require("path")
const { createSecurityHeaderRoutes } = require("@phylopic/ui/securityHeaders")
/** @type {import('next').NextConfig} */
module.exports = {
    outputFileTracingRoot: path.join(__dirname, "../../"),
    serverExternalPackages: ["@aws-sdk/credential-provider-web-identity", "@vercel/functions", "@vercel/oidc"],
    async headers() {
        return createSecurityHeaderRoutes()
    },
    images: {
        remotePatterns: [{ protocol: "https", hostname: "images.phylopic.org" }],
    },
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: "/social/1200x1200.png",
                destination: "https://images.phylopic.org/social/1200x1200.png",
                permanent: true,
            },
        ]
    },
}
