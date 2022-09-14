import Head from "next/head"
import { MediaLink } from "@phylopic/api-models"
import { FC, ReactNode, useMemo } from "react"
import Script from "next/script"
export interface Props {
    children?: ReactNode
    description?: string
    index?: boolean
    socialImage?: MediaLink | null
    title: string
    url: string
}
const DEFAULT_SOCIAL_IMAGE: MediaLink = {
    href: "/social/1200x628.png",
    sizes: "1200x628",
    type: "image/png",
}
const PageHead: FC<Props> = ({
    children,
    description,
    index = false,
    socialImage = DEFAULT_SOCIAL_IMAGE,
    title,
    url,
}) => {
    const [socialImageWidth, socialImageHeight] = useMemo(
        () => socialImage?.sizes.split("x", 2) ?? ["0", "0"],
        [socialImage?.sizes],
    )
    const socialImageHRef = useMemo(() => socialImage?.href ?? "data:", [socialImage?.href])
    return (
        <Head>
            <title key="title">{title}</title>
            <meta key="meta:charSet" charSet="UTF-8" />
            <meta key="meta:X-UA-Compatible" httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <meta key="meta:author" name="author" content="Mike Keesey" />
            <meta key="meta:description" name="description" content={description} />
            <meta key="meta:language" name="language" content="en" />
            <meta key="meta:no-email-collection" name="no-email-collection" content="//unspam.com/noemailcollection" />
            <meta key="meta:reply-to" name="reply-to" content="keesey+phylopic@gmail.com" />
            <meta key="meta:robots" name="robots" content={`${index ? "" : "no"}index`} />
            <meta
                key="meta:theme-color:light"
                name="theme-color"
                content="#305860"
                media="(prefers-color-scheme: light)"
            />
            <meta
                key="meta:theme-color:dark"
                name="theme-color"
                content="#f7fffb"
                media="(prefers-color-scheme: dark)"
            />
            <meta key="meta:twitter:card" name="twitter:card" content="summary_large_image" />
            <meta key="meta:twitter:creator" name="twitter:creator" content="@phylopic" />
            <meta key="meta:twitter:description" name="twitter:description" content={description} />
            <meta key="meta:twitter:image" name="twitter:image" content={socialImageHRef} />
            <meta key="meta:twitter:image:alt" name="twitter:image:alt" content={title} />
            <meta key="meta:twitter:image:height" name="twitter:image:height" content={socialImageHeight} />
            <meta key="meta:twitter:image:width" name="twitter:image:width" content={socialImageWidth} />
            <meta key="meta:twitter:title" name="twitter:title" content={title} />
            <meta key="meta:viewport" name="viewport" content="width=device-width,initial-scale=1" />
            <meta key="meta:og:description" property="og:description" content={description} />
            <meta key="meta:og:image" property="og:image" content={socialImageHRef} />
            <meta key="meta:og:image:alt" property="og:image:alt" content={title} />
            <meta key="meta:og:image:height" property="og:image:height" content={socialImageHeight} />
            <meta key="meta:og:image:type" property="og:image:type" content={socialImage?.type} />
            <meta key="meta:og:image:width" property="og:image:width" content={socialImageWidth} />
            <meta key="meta:og:site_name" property="og:site_name" content="PhyloPic" />
            <meta key="meta:og:title" property="og:title" content={title} />
            <meta key="meta:og:type" property="og:type" content="website" />
            <meta key="meta:og:url" property="og:url" content={url} />
            <link key="link:author" rel="author" href="http://tmkeesey.net" />
            <link key="link:canonical" rel="canonical" href={url} />
            <link key="link:apple-touch-icon" rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link key="link:icon:32x32" rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link key="link:icon:16x16" rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link key="link:manifest" rel="manifest" href="/site.webmanifest" />
            <link
                key="link:search:opensearch"
                rel="search"
                href="/opensearch.xml"
                type="application/opensearchdescription+xml"
                title="Search PhyloPic"
            />
            <link key="link:search" rel="search" href="/search" />
            {process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID && (
                <>
                    <Script
                        async
                        id="gtm"
                        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
                            process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID,
                        )}`}
                        strategy="lazyOnload"
                    />
                    <Script
                        dangerouslySetInnerHTML={{
                            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config",${JSON.stringify(
                                process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID,
                            )})`,
                        }}
                        id="gtm-init"
                        strategy="lazyOnload"
                    />
                </>
            )}
            {children}
        </Head>
    )
}
export default PageHead
