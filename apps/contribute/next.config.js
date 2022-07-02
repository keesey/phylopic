/** @type {import('next').NextConfig} */
module.exports = {
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
    reactStrictMode: true,
}
