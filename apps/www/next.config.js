/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")
const runtimeCaching = require("next-pwa/cache")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
})
const pwa = process.env.NODE_ENV === "production" ? withPWA : x => x
module.exports = withBundleAnalyzer(
    pwa({
        experimental: {
            esmExternals: "loose",
            images: {
                allowFutureImage: true,
            },
        },
        i18n: {
            defaultLocale: "en",
            locales: ["en"],
        },
        images: {
            domains: ["images.phylopic.org"],
        },
        pwa:
            process.env.NODE_ENV === "production"
                ? {
                      dest: "public",
                      runtimeCaching,
                  }
                : undefined,
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
                    destination: `/contributors/${encodeURIComponent(
                        process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID,
                    )}`,
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
    }),
)
