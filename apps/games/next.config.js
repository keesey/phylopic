const path = require("path")
/** @type {import('next').NextConfig} */
module.exports = {
    outputFileTracingRoot: path.join(__dirname, "../../"),
    images: {
        remotePatterns: [{ protocol: "https", hostname: "images.phylopic.org" }],
    },
    reactStrictMode: true,
}
