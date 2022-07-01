/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")
const runtimeCaching = require("next-pwa/cache")

module.exports = withPWA({
    experimental: {
        esmExternals: "loose",
    },
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    images: {
        domains: ["images.phylopic.org"],
    },
    pwa: {
        dest: "public",
        runtimeCaching,
    },
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: "/account",
                destination: "https://contribute.phylopic.org",
                permanent: true,
            },
            {
                source: "/account/:path*",
                destination: "https://contribute.phylopic.org",
                permanent: true,
            },
            {
                source: "/contact",
                destination: "/contributors/060f03a9-fafd-4d08-81d1-b8f82080573f",
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
        ]
    },
})
