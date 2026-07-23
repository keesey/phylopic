const path = require("path")
/** @type {import('next').NextConfig} */
module.exports = {
    outputFileTracingRoot: path.join(__dirname, "../../"),
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
