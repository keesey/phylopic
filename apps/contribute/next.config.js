/** @type {import('next').NextConfig} */
module.exports = {
    images: {
        domains: ["images.phylopic.org"],
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
    swcMinify: true,
}
