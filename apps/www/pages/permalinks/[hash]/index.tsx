import { GetObjectCommandOutput, S3Client } from "@aws-sdk/client-s3"
import { TimestampView } from "@phylopic/ui"
import { Hash, isHash } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import type { Compressed } from "compress-json"
import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { NextSeo } from "next-seo"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import PERMALINKS_BUCKET_NAME from "~/permalinks/constants/PERMALINKS_BUCKET_NAME"
import usePermalinkSubheader from "~/permalinks/hooks/usePermalinkSubheader"
import { PermalinkData } from "~/permalinks/types/PermalinkData"
import PermalinkView from "~/permalinks/views/PermalinkView"
import CompressedSWRConfig from "~/swr/CompressedSWRConfig"
import Breadcrumbs from "~/ui/Breadcrumbs"
import SiteTitle from "~/ui/SiteTitle"
type Props = Omit<PageLayoutProps, "children"> & {
    data: PermalinkData
    date?: string
    fallback?: Compressed
    hash: Hash
}
const PageComponent: NextPage<Props> = ({ fallback, ...props }) => {
    const subheader = usePermalinkSubheader(props.data)
    const url = `${process.env.NEXT_PUBLIC_WWW_URL}/permalink/${encodeURIComponent(props.hash)}`
    return (
        <CompressedSWRConfig fallback={fallback}>
            <PageLayout {...props}>
                <NextSeo
                    title="PhyloPic: Permalink"
                    canonical={url}
                    description="Permanent data resource for PhyloPic."
                />
                <header>
                    <Breadcrumbs
                        items={[
                            { children: "Home", href: "/" },
                            { children: "Permalinks" },
                            { children: <strong>{subheader ?? "Permalink"}</strong> },
                        ]}
                    />
                    <h1>Permalink{subheader && `: ${subheader}`}</h1>
                </header>
                <p>
                    {props.date && (
                        <>
                            Created at <TimestampView value={props.date} format="datetime" />.{" "}
                        </>
                    )}
                    This is a permanent reference. The information on this page will not change when the rest of{" "}
                    <SiteTitle /> changes.
                </p>
                <PermalinkView url={url} value={props.data} />
            </PageLayout>
        </CompressedSWRConfig>
    )
}
export default PageComponent
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        fallback: "blocking",
        paths: [],
    }
}
export const getStaticProps: GetStaticProps<Props, { hash: Hash }> = async context => {
    const { hash } = context.params ?? {}
    if (!isHash(hash)) {
        return { notFound: true }
    }
    const client = new S3Client({
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
        },
        region: process.env.S3_REGION,
    })
    let data: PermalinkData
    let output: GetObjectCommandOutput
    try {
        ;[data, output] = await getJSON<PermalinkData>(client, {
            Bucket: PERMALINKS_BUCKET_NAME,
            Key: `data/${encodeURIComponent(hash)}.json`,
        })
    } finally {
        client.destroy()
    }
    if (typeof output.$metadata.httpStatusCode === "number" && output.$metadata.httpStatusCode >= 400) {
        return { notFound: true }
    }
    return {
        props: {
            data,
            date: output.LastModified?.toISOString(),
            hash,
        },
    }
}
