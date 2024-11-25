import Container from "~/ui/Container"
import Schema from "./schema"
import { Metadata } from "next"
export const metadata: Metadata = {
    authors: [{ name: "T. Michael Keesey", url: "http://tmkeesey.net" }],
    icons: [
        { url: `${process.env.NEXT_PUBLIC_WWW_URL}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" },
        { url: `${process.env.NEXT_PUBLIC_WWW_URL}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
        { url: `${process.env.NEXT_PUBLIC_WWW_URL}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
    ],
    manifest: `${process.env.NEXT_PUBLIC_WWW_URL}/site.webmanifest`,
    openGraph: {
        emails: "keesey+phylopic@gmail.com",
        images: {
            alt: "PhylopPic: an open database of freely reusable silhouettes of life forms — www.phylopic.org",
            height: 1200,
            url: "https://images.phylopic.org/social/1200x1200.png",
            width: 1200,
        },
        locale: "en_US",
        siteName: "PhyloPic",
        type: "website",
        url: process.env.NEXT_PUBLIC_WWW_URL
    },
    other: {
        language: "en",
        "no-email-collection": "https://unspam.com/noemailcollection",
        "reply-to": "keesey+phylopic@gmail.com"
    },
    title: "PhyloPic",

    // :TODO: search links, viewport, theme color
}
export default function HomePage() {
    return (
        <>
            <Schema />
            <header>
                <Container>
                    <strong>Free silhouette images</strong> of animals, plants, and other life forms,{" "}
                    <strong>available for reuse</strong> under{" "}
                    <a href="//creativecommons.org" rel="external">
                        Creative Commons
                    </a>{" "}
                    licenses.
                </Container>
            </header>
        </>
    )
}
