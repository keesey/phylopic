import { INCOMPLETE_STRING, Submission } from "@phylopic/source-models"
import { Hash, isHash } from "@phylopic/utils"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head"
import useSWR, { SWRConfig } from "swr"
import fetchJSON from "~/fetch/fetchJSON"
import Breadcrumbs from "~/ui/Breadcrumbs"
import SubmissionNameView from "~/views/SubmissionNameView"
import TimesView from "~/views/TimesView"
export type Props = {
    hash: Hash
}
const Page: NextPage<Props> = ({ hash }) => {
    const { data: submission } = useSWR<Submission>(`/api/submissions/_/${hash}`, fetchJSON)
    return (
        <SWRConfig>
            <Head>
                <title>PhyloPic Editor: Submission by {submission?.attribution ?? INCOMPLETE_STRING}</title>
            </Head>
            <main>
                <header>
                    <Breadcrumbs
                        items={[
                            { href: "/", children: "Home" },
                            { href: "/submissions", children: "Submissions" },
                            {
                                children: <>Submission by {submission?.attribution ?? INCOMPLETE_STRING}</>,
                            },
                        ]}
                    />
                    <h1>Submission by {submission?.attribution ?? INCOMPLETE_STRING}</h1>
                    {submission && (
                        <h2>
                            <SubmissionNameView submission={submission} />
                        </h2>
                    )}
                </header>
                :TODO:
                <footer>
                    <TimesView created={submission?.created} />
                </footer>
            </main>
        </SWRConfig>
    )
}
export default Page
export const getStaticProps: GetStaticProps<Props> = context => {
    const { hash } = context.params ?? {}
    if (!isHash(hash)) {
        return { notFound: true }
    }
    return { props: { hash } }
}
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        fallback: "blocking",
        paths: [],
    }
}
