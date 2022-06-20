/** @type {import('next').NextConfig} */
module.exports = {
    experimental: {
        esmExternals: "loose",
    },
    images: {
        domains: ["images.phylopic.org"],
    },
    reactStrictMode: true,
}
