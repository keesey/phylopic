import { Contributor, Image, INCOMPLETE_STRING, Node } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { FC } from "react"
import useSWR, { SWRConfig } from "swr"
import Paginator from "~/pagination/Paginator"
import Breadcrumbs from "~/ui/Breadcrumbs"
import NameView from "~/views/NameView"
const Page: NextPage = () => {
    return (
        <SWRConfig>
            <Head>
                <title>PhyloPic Editor: Images</title>
            </Head>
            <main>
                <header>
                    <Breadcrumbs items={[{ href: "/", children: <a>Home</a> }, { children: "Images" }]} />
                    <h1>Images</h1>
                </header>
                <Paginator endpoint="/api/images">
                    {(items, invalidating) =>
                        items.length ? (
                            <ul>
                                {(items as ReadonlyArray<Image & { uuid: UUID }>).map(image => (
                                    <li key={image.uuid}>
                                        <Link href={`/images/${encodeURIComponent(image.uuid)}`}>
                                            <ImageView image={image} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : invalidating ? null : (
                            <p>No images found.</p>
                        )
                    }
                </Paginator>
            </main>
        </SWRConfig>
    )
}
export default Page
const ImageView: FC<{ image: Image & { uuid: UUID } }> = ({ image }) => {
    const { data: specific } = useSWR<Node & { uuid: UUID }>(
        image.specific ? `/api/nodes/_/${encodeURIComponent(image.specific)}` : null,
        fetchJSON,
    )
    const { data: general } = useSWR<Node & { uuid: UUID }>(
        image.general ? `/api/nodes/_/${encodeURIComponent(image.general)}` : null,
        fetchJSON,
    )
    const { data: contributor } = useSWR<Contributor & { uuid: UUID }>(
        `/api/contributors/_/${encodeURIComponent(image.contributor)}`,
        fetchJSON,
    )
    return (
        <>
            {specific ? <NameView name={specific.names[0]} short /> : INCOMPLETE_STRING}
            {general ? (
                <>
                    {" "}
                    (<NameView name={general.names[0]} short />)
                </>
            ) : null}
            <> by </>
            {image.attribution || "[Anonymous]"}
            <> (uploaded by {contributor ? contributor.name : INCOMPLETE_STRING})</>
        </>
    )
}
