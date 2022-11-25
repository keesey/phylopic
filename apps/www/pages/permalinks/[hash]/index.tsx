import { GetObjectCommandOutput, S3Client } from "@aws-sdk/client-s3"
import { Hash, isHash } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import PageHead from "~/metadata/PageHead"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import PERMALINKS_BUCKET_NAME from "~/permalinks/constants/PERMALINKS_BUCKET_NAME"
import { PermalinkData } from "~/permalinks/types/PermalinkData"
import Breadcrumbs from "~/ui/Breadcrumbs"
type Props = Omit<PageLayoutProps, "children"> & {
    data: PermalinkData
    date?: string
    hash: Hash
}
const PageComponent: NextPage<Props> = props => {
    return (
        <PageLayout {...props}>
            <PageHead
                title="PhyloPic: Permalink"
                url="https://www.phylopic.org/images/"
                description="Permanent data resource for PhyloPic."
            />
            <header>
                <Breadcrumbs
                    items={[
                        { children: "Home", href: "/" },
                        { children: <strong>Permalink</strong> },
                    ]}
                />
                <h1>Permalink</h1>
                {props.date && <p>Created at <time dateTime={props.date}>{new Date(props.date).toLocaleString("en-us", { timeZone: "UTC" })} UTC</time>.</p>}
            </header>
            <pre>
                {JSON.stringify(props.data, undefined, "\t")}
            </pre>
        </PageLayout>
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
    const client = new S3Client({})
    let data: PermalinkData
    let output: GetObjectCommandOutput
    try {
        [data, output] = await getJSON<PermalinkData>(client, {
            Bucket: PERMALINKS_BUCKET_NAME,
            Key: `data/${encodeURIComponent(hash)}.json`
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
        }
    }
}
