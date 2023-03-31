import { GTagAnalytics } from "@phylopic/ui"
import { Analytics as VercelAnalytics } from "@vercel/analytics/react"
import { DefaultSeo } from "next-seo"
import type { AppProps } from "next/app"
import "../src/styles/globals.scss"
const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <DefaultSeo
                additionalLinkTags={[
                    { href: "http://tmkeesey.net", rel: "author" },
                    { href: "/apple-touch-icon.png", rel: "icon", sizes: "180x180", type: "image/png" },
                    { href: "/favicon-32x32.png", rel: "icon", sizes: "32x32", type: "image/png" },
                    { href: "/favicon-16x16.png", rel: "icon", sizes: "16x16", type: "image/png" },
                    { href: "/site.webmanifest", rel: "manifest" },
                ]}
                additionalMetaTags={[
                    { name: "author", content: "T. Michael Keesey" },
                    { name: "language", content: "en" },
                    { name: "no-email-collection", content: "//unspam.com/noemailcollection" },
                    { name: "reply-to", content: "keesey+phylopic@gmail.com" },
                    { name: "viewport", content: "width=device-width,initial-scale=1" },
                ]}
                defaultOpenGraphImageHeight={1200}
                defaultOpenGraphImageWidth={1200}
                openGraph={{
                    images: [{ url: "https://images.phylopic.org/social/1200x1200.png" }],
                    locale: "en_US",
                    siteName: "PhyloPic: Contribute",
                    type: "website",
                    url: process.env.NEXT_PUBLIC_CONTRIBUTE_URL + "/",
                }}
                themeColor="#305860"
            />
            {process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID && (
                <GTagAnalytics gaMeasurementId={process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID} />
            )}
            <Component {...pageProps} />
            <VercelAnalytics />
        </>
    )
}
export default App
