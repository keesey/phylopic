import { Image, INCOMPLETE_STRING, Node } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/utils-api"
import { isUUIDv4, stringifyNomen, UUID } from "@phylopic/utils"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { useMemo } from "react"
import useSWR, { SWRConfig } from "swr"
import ImageEditor from "~/editors/ImageEditor"
import ImageFileEditor from "~/editors/ImageFileEditor"
import Breadcrumbs from "~/ui/Breadcrumbs"
import ImageTitleView from "~/views/ImageTitleView"
import TimesView from "~/views/TimesView"

export type Props = {
    uuid: UUID
}
const Page: NextPage<Props> = ({ uuid }) => {
    const { data: image } = useSWR<Image & { uuid: UUID }>(`/api/images/_/${uuid}`, fetchJSON)
    const { data: specific } = useSWR<Node & { uuid: UUID }>(image ? `/api/nodes/_/${image.specific}` : null, fetchJSON)
    const specificNameText = useMemo(
        () => (specific ? stringifyNomen(specific.names[0]) : INCOMPLETE_STRING),
        [specific],
    )
    return (
        <SWRConfig>
            <Head>
                <title>
                    PhyloPic Editor: {specificNameText} by {image?.attribution ?? INCOMPLETE_STRING}
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
                                        name={specific?.names[0] ?? null}
                                        attribution={image?.attribution ?? null}
                                        sponsor={image?.sponsor ?? null}
                                    />
                                ),
                            },
                        ]}
                    />
                    <h1>
                        <ImageTitleView
                            name={specific?.names[0] ?? null}
                            attribution={image?.attribution ?? null}
                            sponsor={image?.sponsor ?? null}
                        />
                    </h1>
                </header>
                <ImageFileEditor uuid={uuid} />
                <br />
                <ImageEditor uuid={uuid} />
                <footer>
                    <TimesView created={image?.created} modified={image?.modified} />
                </footer>
            </main>
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
