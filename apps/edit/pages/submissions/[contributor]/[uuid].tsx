import { S3Client } from "@aws-sdk/client-s3"
import {
    CONTRIBUTE_BUCKET_NAME,
    Contribution,
    findImageSourceFile,
    getLineage,
    isContribution,
    isSource,
    NodeIdentifier,
    Source,
    SOURCE_BUCKET_NAME,
} from "@phylopic/source-models"
import { Identifier, ImageMediaType, isEmailAddress, isUUID, normalizeUUID, stringifyNormalized } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { useEffect } from "react"
import SubmissionEditorContainer from "~/contexts/SubmissionEditorContainer"
import ImageFileEditor from "~/editors/ImageFileEditor"
import SubmissionEditor from "~/editors/SubmissionEditor"
import Breadcrumbs from "~/ui/Breadcrumbs"
import getImageMediaTypeFromFileName from "~/utils/getImageMediaTypeFromFileName"
import ImageTitleView from "~/views/ImageTitleView"
import TimesView from "~/views/TimesView"

export type Props = {
    contribution: Contribution
    lineage: readonly NodeIdentifier[]
    mediaType: ImageMediaType
    source: Source
    warning?: string
}
const Page: NextPage<Props> = ({ contribution, lineage, mediaType, source, warning }) => {
    useEffect(() => {
        if (warning) {
            alert(warning)
        }
    }, [warning])
    return (
        <SubmissionEditorContainer mediaType={mediaType} lineage={lineage} source={source} value={contribution}>
            <Head>
                <title>
                    {"Submission: "}
                    {contribution.specific.name.map(({ text }) => text).join(" ")}
                    {" by "}
                    {contribution.contributor}
                </title>
            </Head>
            <main>
                <header>
                    <Breadcrumbs
                        items={[
                            { href: "/", children: "Home" },
                            { href: "/submissions", children: "Submissions" },
                            {
                                href: `/submissions/${encodeURIComponent(contribution.contributor)}`,
                                children: contribution.contributor,
                            },
                            {
                                children: (
                                    <ImageTitleView
                                        name={contribution.specific.name}
                                        attribution={contribution.attribution}
                                        sponsor={contribution.sponsor}
                                    />
                                ),
                            },
                        ]}
                    />
                    <h1>
                        <ImageTitleView
                            name={contribution.specific.name}
                            attribution={contribution.attribution}
                            sponsor={contribution.sponsor}
                        />
                    </h1>
                </header>
                <SubmissionEditor />
                <ImageFileEditor
                    apiPath={`/api/submissionfiles/${encodeURIComponent(contribution.contributor)}/${
                        contribution.uuid
                    }`}
                    mediaType={mediaType}
                />
                <footer>
                    <TimesView created={contribution.created} />
                </footer>
            </main>
        </SubmissionEditorContainer>
    )
}
export default Page
const isInternal = (identifier: Identifier | null | undefined): identifier is Identifier =>
    Boolean(identifier && identifier.startsWith("phylopic.org/nodes/"))
const getLineageOfIdentifiers = async (
    client: S3Client,
    contribution: Contribution,
): Promise<[readonly NodeIdentifier[], string | undefined]> => {
    let warning: string | undefined
    if (isInternal(contribution.specific.identifier)) {
        try {
            let entities = await getLineage(
                client,
                contribution.specific.identifier[2],
                isInternal(contribution.general?.identifier)
                    ? contribution.general?.identifier[2] ?? null
                    : contribution.specific.identifier[2],
            )
            if (entities.length > 1 && entities[0].uuid !== contribution.general?.identifier?.[2]) {
                warning = "Submission has an invalid general node."
                entities = [entities[entities.length - 1]]
            }
            return [
                entities.map<NodeIdentifier>(entity => ({
                    identifier: ["phylopic.org", "nodes", entity.uuid].join("/"),
                    name: entity.value.names[0],
                })),
                warning,
            ]
        } catch {
            // :TODO: Check if it was because a node hasn't been ported yet.
        }
    }
    return [[...(contribution.general ? [contribution.general] : []), contribution.specific], warning]
}
export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
    const { contributor, uuid } = params ?? {}
    if (!isEmailAddress(contributor)) {
        console.warn("Not a valid email address: ", contributor)
        return { notFound: true }
    }
    if (!isUUID(uuid)) {
        console.warn("Not a valid UUID: ", uuid)
        return { notFound: true }
    }
    const uuidNormalized = normalizeUUID(uuid)
    let result: GetServerSidePropsResult<Props>
    const client = new S3Client({})
    const path = `contributions/${uuidNormalized}/`
    try {
        // eslint-disable-next-line prefer-const
        let [[contribution], file, [source]] = await Promise.all([
            getJSON<Contribution>(
                client,
                {
                    Bucket: CONTRIBUTE_BUCKET_NAME,
                    Key: s`${path}meta.json`,
                },
                isContribution,
            ),
            findImageSourceFile(client, CONTRIBUTE_BUCKET_NAME, `${path}source.`),
            getJSON<Source>(
                client,
                {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: "meta.json",
                },
                isSource,
            ),
        ])
        if (!contribution || !file || !source) {
            console.warn("Possibly not found: ", contribution)
            console.warn("Possibly not found: ", file)
            console.warn("Possibly not found: ", source)
            result = { notFound: true }
        } else {
            const [lineage, warning] = await getLineageOfIdentifiers(client, contribution)
            if (warning) {
                contribution = JSON.parse(
                    stringifyNormalized({
                        ...contribution,
                        general: null,
                    }),
                )
            }
            result = {
                props: {
                    contribution,
                    lineage,
                    mediaType: getImageMediaTypeFromFileName(file?.Key),
                    source,
                    ...(warning ? { warning } : null),
                },
            }
        }
    } finally {
        client.destroy()
    }
    return result
}
