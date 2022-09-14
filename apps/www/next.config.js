/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    images: {
        domains: ["images.phylopic.org"],
    },
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: "/account",
                destination: process.env.NEXT_PUBLIC_CONTRIBUTE_URL,
                permanent: true,
            },
            {
                source: "/account/:path*",
                destination: process.env.NEXT_PUBLIC_CONTRIBUTE_URL,
                permanent: true,
            },
            {
                source: "/contact",
                destination: `/contributors/${encodeURIComponent(process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID)}`,
                permanent: true,
            },
            {
                source: "/contribute",
                destination: process.env.NEXT_PUBLIC_CONTRIBUTE_URL,
                permanent: true,
            },
            {
                source: "/donate",
                destination: "https://www.paypal.com/donate/?hosted_button_id=9GL697FDK7ZWW",
                permanent: true,
            },
            {
                source: "/image/browse",
                destination: "/images",
                permanent: true,
            },
            {
                source: "/image/:uuid",
                destination: "/images/:uuid",
                permanent: true,
            },
            {
                source: "/materials",
                destination: "https://keesey.gumroad.com/l/pocketphylogenies",
                permanent: true,
            },
            {
                source: "/name/:path*",
                destination: "/nodes/:path*",
                permanent: true,
            },
            {
                source: "/root",
                destination: `/nodes/${encodeURIComponent(process.env.NEXT_PUBLIC_ROOT_UUID)}`,
                permanent: true,
            },
        ]
    },
    swcMinify: true,
}
const runtimeCaching = require("next-pwa/cache")
const withPWA = require("next-pwa")({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
})
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
})
const config = withBundleAnalyzer(
    withPWA({
        ...nextConfig,
        pwa: {
            dest: "public",
            runtimeCaching,
        },
    }),
)
delete config.pwa
module.exports = config
