/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "false" },
                    { key: "Access-Control-Allow-Origin", value: "https://www.phylopic.org" },
                    { key: "Access-Control-Allow-Methods", value: "GET,HEAD" },
                    { key: "Access-Control-Allow-Headers", value: "Accept,Content-Type" },
                ],
            },
        ]
    },
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
                source: "/articles",
                destination: "/articles/api-recipes",
                permanent: false,
            },
            {
                source: "/contact",
                destination: `/contributors/${encodeURIComponent(
                    process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID,
                )}/t-michael-keesey-silhouettes`,
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
                destination:
                    "https://www.patreon.com/tmkeesey/shop/pocket-phylogenies-print-out-1429988?source=phylopic",
                permanent: true,
            },
            {
                source: "/name/:path*",
                destination: "/nodes/:path*",
                permanent: true,
            },
            {
                source: "/root",
                destination: `/nodes/${encodeURIComponent(process.env.NEXT_PUBLIC_ROOT_UUID)}/pan-biota-silhouettes`,
                permanent: true,
            },
            {
                source: "/social/1200x1200.png",
                destination: "https://images.phylopic.org/social/1200x1200.png",
                permanent: true,
            },
            {
                source: "/sponsorship",
                destination: "https://forms.gle/LR6sBChZNdxtJBHz8",
                permanent: false,
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
