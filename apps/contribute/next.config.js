/** @type {import('next').NextConfig} */
module.exports = {
    experimental: {
        images: {
            allowFutureImage: true,
        },
    },
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    images: {
        domains: ["contribute.phylopic.org", "images.phylopic.org"],
    },
    reactStrictMode: true,
    webpack: {
        resolve: {
            fallback: {
                async_hooks: false,
            },
        },
    },
}
