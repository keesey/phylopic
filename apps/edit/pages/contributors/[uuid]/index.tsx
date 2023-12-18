import { Contributor, INCOMPLETE_STRING, Image, Submission } from "@phylopic/source-models"
import { Loader, fetchJSON } from "@phylopic/ui"
import { Hash, UUID, isUUIDv4 } from "@phylopic/utils"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { FC } from "react"
import useSWR, { SWRConfig } from "swr"
import Paginator from "~/pagination/Paginator"
import Breadcrumbs from "~/ui/Breadcrumbs"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
import IdentifierView from "~/views/IdentifierView"
import TimesView from "~/views/TimesView"
export type Props = {
    uuid: UUID
}
const Page: NextPage<Props> = ({ uuid }) => {
    return (
        <SWRConfig>
            <Content uuid={uuid} />
        </SWRConfig>
    )
}
export default Page
export const getStaticProps: GetStaticProps<Props> = context => {
    const { uuid } = context.params ?? {}
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    return { props: { uuid } }
}
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        fallback: "blocking",
        paths: [],
    }
}
const Content: FC<Props> = ({ uuid }) => {
    const { data: contributor, mutate: mutateNode } = useSWR<Contributor & { uuid: UUID }>(
        `/api/contributors/_/${uuid}`,
        fetchJSON,
    )
    return (
        <>
            <Head>
                <title>PhyloPic Editor: {contributor?.name}</title>
            </Head>
            {!contributor && <Loader />}
            {contributor && (
                <main>
                    <header>
                        <Breadcrumbs
                            items={[
                                { href: "/", children: "Home" },
                                { href: "/contributors", children: "Contributors" },
                                {
                                    children: contributor ? <>{contributor.name}</> : INCOMPLETE_STRING,
                                },
                            ]}
                        />
                        <h1>{contributor && <>{contributor.name}</>}</h1>
                        <a href={`mailto:${contributor.emailAddress}`}>
                            <code>{contributor.emailAddress}</code>
                        </a>
                    </header>
                    <section>
                        <h2>Submissions</h2>
                        <Paginator endpoint={`/api/contributors/_/${encodeURIComponent(uuid)}/submissions`}>
                            {(submissions, isValidating) =>
                                submissions.length ? (
                                    <BubbleList>
                                        {(submissions as ReadonlyArray<Submission & { Key: string }>).map(
                                            submission => (
                                                <BubbleItem key={submission.Key}>
                                                    <Link
                                                        href={`/submissions/${encodeURIComponent(
                                                            submission.Key.replace(/^files\//, ""),
                                                        )}`}
                                                    >
                                                        {submission.identifier ? (
                                                            <IdentifierView value={submission.identifier} />
                                                        ) : (
                                                            "[Unassigned]"
                                                        )}
                                                    </Link>
                                                </BubbleItem>
                                            ),
                                        )}
                                    </BubbleList>
                                ) : isValidating ? (
                                    <Loader />
                                ) : (
                                    <p>No submissions.</p>
                                )
                            }
                        </Paginator>
                    </section>
                    <section>
                        <h2>Images</h2>
                        <Paginator endpoint={`/api/contributors/_/${encodeURIComponent(uuid)}/images`}>
                            {(images, isValidating) =>
                                images.length ? (
                                    <BubbleList>
                                        {(images as ReadonlyArray<Image & { uuid: UUID }>).map(image => (
                                            <BubbleItem key={image.uuid}>
                                                <Link href={`/images/${encodeURIComponent(image.uuid)}`}>
                                                    <IdentifierView value={image.specific} />
                                                </Link>
                                            </BubbleItem>
                                        ))}
                                    </BubbleList>
                                ) : isValidating ? (
                                    <Loader />
                                ) : (
                                    <p>No images.</p>
                                )
                            }
                        </Paginator>
                    </section>
                    <footer>
                        <TimesView created={contributor?.created} modified={contributor?.modified} />
                    </footer>
                </main>
            )}
        </>
    )
}
