import { Contributor, Image, INCOMPLETE_STRING, Node } from "@phylopic/source-models"
import { AnchorLink } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { FC, useMemo } from "react"
import useSWR, { SWRConfig } from "swr"
import fetchJSON from "~/fetch/fetchJSON"
import Paginator from "~/pagination/Paginator"
import Breadcrumbs from "~/ui/Breadcrumbs"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
import NameView from "~/views/NameView"
export type Props = {
    filter?: "accepted" | "incomplete" | "submitted" | "withdrawn"
}
const Page: NextPage<Props> = ({ filter }) => {
    const filterName = useMemo(() => (filter ? filter.charAt(0).toUpperCase() + filter.slice(1) + " " : ""), [filter])
    return (
        <SWRConfig>
            <Head>
                <title>PhyloPic Editor: {filterName}Images</title>
            </Head>
            <main>
                <header>
                    <Breadcrumbs
                        items={[
                            { href: "/", children: <a>Home</a> },
                            { href: filter ? "/images" : undefined, children: "Images" },
                            ...(filter ? [{ children: filterName }] : []),
                        ]}
                    />
                    <h1>Images</h1>
                </header>
                <nav>
                    <BubbleList>
                        <BubbleItem light={filter === "incomplete"}>
                            <AnchorLink href="/images?filter=incomplete">Incomplete</AnchorLink>
                        </BubbleItem>
                        <BubbleItem light={filter === "submitted"}>
                            <AnchorLink href="/images?filter=submitted">Submitted</AnchorLink>
                        </BubbleItem>
                        <BubbleItem light={filter === "accepted"}>
                            <AnchorLink href="/images?filter=accepted">Accepted</AnchorLink>
                        </BubbleItem>
                        <BubbleItem light={filter === "withdrawn"}>
                            <AnchorLink href="/images?filter=withdrawn">Withdrawn</AnchorLink>
                        </BubbleItem>
                    </BubbleList>
                </nav>
                <Paginator endpoint={`/api/images${filter ? `/${filter}` : ""}`}>
                    {(items, invalidating) =>
                        items.length ? (
                            <ul>
                                {(items as ReadonlyArray<Image & { uuid: UUID }>).map(image => (
                                    <li key={image.uuid}>
                                        <AnchorLink href={`/images/${encodeURIComponent(image.uuid)}`}>
                                            <ImageView image={image} />
                                        </AnchorLink>
                                    </li>
                                ))}
                            </ul>
                        ) : invalidating ? null : (
                            <p>No {filterName.toLowerCase()}images found.</p>
                        )
                    }
                </Paginator>
            </main>
        </SWRConfig>
    )
}
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const { filter } = context.query
    if (filter === "accepted" || filter === "submitted" || filter === "incomplete" || filter === "withdrawn") {
        return { props: { filter } }
    }
    return { props: {} }
}
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
            {specific ? <NameView name={specific.names[0]} short /> : "[Unassigned]"}
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
