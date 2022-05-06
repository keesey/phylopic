/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: "/account/login",
                destination: "/contribute/images",
                permanent: true,
            },
            {
                source: "/account/images/submit",
                destination: "/contribute/images",
                permanent: true,
            },
            {
                source: "/apidocs",
                destination: "https://api-docs.phylopic.org/",
                permanent: true,
            },
            {
                source: "/code",
                destination: "https://github.com/keesey/phylopic/",
                permanent: true,
            },
            {
                source: "/contact",
                destination: "/contributors/keesey%40gmail.com",
                permanent: true,
            },
            {
                source: "/donate",
                destination: "/contribute",
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
                source: "/name/:path*",
                destination: "/nodes/:path*",
                permanent: true,
            },
        ]
    },
}
