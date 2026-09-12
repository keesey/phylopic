const path = require("path")
const { createSecurityHeaderRoutes } = require("@phylopic/ui/securityHeaders")
/** @type {import('next').NextConfig} */
module.exports = {
    outputFileTracingRoot: path.join(__dirname, "../../"),
    async headers() {
        return createSecurityHeaderRoutes({ development: process.env.NODE_ENV === "development" })
    },
    reactStrictMode: true,
}
