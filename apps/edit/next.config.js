const path = require("path")
/** @type {import('next').NextConfig} */
module.exports = {
    outputFileTracingRoot: path.join(__dirname, "../../"),
    reactStrictMode: true,
}
