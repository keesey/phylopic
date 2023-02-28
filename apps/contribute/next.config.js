/** @type {import('next').NextConfig} */
module.exports = {
    images: {
        domains: ["images.phylopic.org"],
    },
    reactStrictMode: true,
    redirects: [
        {
            source: "/social/1200x1200.png",
            destination: "https://images.phylopic.org/social/1200x1200.png",
            permanent: true,
        },
    ],
    swcMinify: true,
}
