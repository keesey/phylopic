import { S3Client } from "@aws-sdk/client-s3"
import {
    Entity,
    findImageSourceFile,
    getLineage,
    Image,
    isImage,
    isSource,
    Node,
    Source,
    SOURCE_BUCKET_NAME,
} from "@phylopic/source-models"
import { ImageMediaType, ISOTimestamp, UUID } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import React from "react"
import ImageEditorContainer from "~/contexts/ImageEditorContainer"
import ImageEditor from "~/editors/ImageEditor"
import ImageFileEditor from "~/editors/ImageFileEditor"
import Breadcrumbs from "~/ui/Breadcrumbs"
import ImageTitleView from "~/views/ImageTitleView"
import TimesView from "~/views/TimesView"

export type Props = {
    image: Image
    lineage: readonly Entity<Node>[]
    mediaType: ImageMediaType
    modified?: ISOTimestamp
    source: Source
    uuid: UUID
}
const Page: NextPage<Props> = ({ mediaType, image, lineage, source, modified, uuid }) => {
    const specificName = lineage?.[lineage.length - 1]?.value?.names?.[0]
    return (
        <ImageEditorContainer mediaType={mediaType} lineage={lineage} source={source} value={image} uuid={uuid}>
            <Head>
                <title>
                    PhyloPic Editor: {specificName?.map(({ text }) => text).join(" ") ?? "Image"} by {image.contributor}
                </title>
            </Head>
            <main>
                <header>
                    <Breadcrumbs
                        items={[
                            { href: "/", children: "Home" },
                            { href: "/images", children: "Images" },
                            {
                                children: (
                                    <ImageTitleView
                                        name={specificName}
                                        attribution={image.attribution}
                                        sponsor={image.sponsor}
                                    />
                                ),
                            },
                        ]}
                    />
                    <h1>
                        <ImageTitleView name={specificName} attribution={image.attribution} sponsor={image.sponsor} />
                    </h1>
                </header>
                <ImageEditor />
                <ImageFileEditor apiPath={`/api/imagefiles/${uuid}`} mediaType={mediaType} />
                <footer>
                    <TimesView created={image.created} modified={modified} />
                </footer>
            </main>
        </ImageEditorContainer>
    )
}
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
    if (typeof query.uuid !== "string") {
        return { notFound: true }
    }
    const client = new S3Client({})
    let props: Props
    try {
        const [[image, output], file, [source]] = await Promise.all([
            getJSON<Image>(
                client,
                {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: `images/${query.uuid}/meta.json`,
                },
                isImage,
            ),
            findImageSourceFile(client, SOURCE_BUCKET_NAME, `images/${query.uuid}/source.`),
            getJSON<Source>(
                client,
                {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: "meta.json",
                },
                isSource,
            ),
        ])
        if (!image || !file || !source) {
            return { notFound: true }
        }
        const lineage = await getLineage(client, image.specific, image.general)
        props = {
            mediaType: file?.Key?.endsWith(".svg") ? "image/svg+xml" : "image/png",
            image,
            lineage,
            modified: output.LastModified?.toISOString(),
            source,
            uuid: query.uuid,
        }
    } finally {
        client.destroy()
    }
    return { props }
}
