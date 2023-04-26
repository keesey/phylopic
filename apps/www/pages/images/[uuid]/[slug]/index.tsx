import { ImageParameters, ImageWithEmbedded } from "@phylopic/api-models"
import { ImageContainer, TimestampView, useLicenseText, useNomenText } from "@phylopic/ui"
import {
    createSearch,
    extractPath,
    isDefined,
    isUUIDv4,
    Nomen,
    Query,
    shortenNomen,
    stringifyNomen,
    UUID,
} from "@phylopic/utils"
import { addBuildToURL, fetchResult } from "@phylopic/utils-api"
import type { Compressed } from "compress-json"
import type { GetStaticProps, NextPage } from "next"
import { NextSeo } from "next-seo"
import dynamic from "next/dynamic"
import Link from "next/link"
import { FC, useContext, useMemo } from "react"
import { unstable_serialize } from "swr"
import customEvents from "~/analytics/customEvents"
import CollectionsContext from "~/collections/context/CollectionsContext"
import useCurrentCollectionImages from "~/collections/hooks/useCurrentCollectionImages"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import VisualArtworkSchemaScript from "~/metadata/SchemaScript/VisualArtworkSchemaScript"
import useOpenGraphForImage from "~/metadata/useOpenGraphForImage"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import DonationPromo from "~/promos/DonationPromo"
import getContributorHRef from "~/routes/getContributorHRef"
import getImageHRef from "~/routes/getImageHRef"
import getImageSlug from "~/routes/getImageSlug"
import getNodeHRef from "~/routes/getNodeHRef"
import createStaticPathsGetter from "~/ssg/createListStaticPathsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import CompressedSWRConfig from "~/swr/CompressedSWRConfig"
import compressFallback from "~/swr/compressFallback"
import Breadcrumbs from "~/ui/Breadcrumbs"
import Container from "~/ui/Container"
import HeaderNav from "~/ui/HeaderNav"
import NameList from "~/ui/NameList"
import SiteTitle from "~/ui/SiteTitle"
import ImageFilesView from "~/views/ImageFilesView"
import ImageRasterView from "~/views/ImageRasterView"
import LicenseDetailsView from "~/views/LicenseDetailsView"
import LicenseView from "~/views/LicenseView"
import NomenView from "~/views/NomenView"
const ContributorBanner = dynamic(() => import("~/contribute/ContributorBanner"), { ssr: false })
const IMAGE_QUERY: Omit<ImageParameters, "uuid"> & Query = {
    embed_nodes: "true",
    embed_specificNode: "true",
}
type Props = Omit<PageLayoutProps, "children"> & {
    fallback?: Compressed
    uuid: UUID
}
const PageComponent: NextPage<Props> = ({ fallback, uuid, ...props }) => {
    return (
        <CompressedSWRConfig fallback={fallback}>
            <PageLayout aside={<ContributorBanner imageUUID={uuid} />} {...props}>
                <ImageContainer uuid={uuid} query={IMAGE_QUERY}>
                    {image => (image ? <Content image={image} /> : null)}
                </ImageContainer>
            </PageLayout>
        </CompressedSWRConfig>
    )
}
const Content: FC<{ image: ImageWithEmbedded }> = ({ image }) => {
    const [, dispatch] = useContext(CollectionsContext)
    const images = useCurrentCollectionImages()
    const isInCollection = useMemo(() => images.some(i => i.uuid === image.uuid), [image.uuid, images])
    const nameLong = useNomenText(image._embedded.specificNode?.names[0])
    const nameShort = useNomenText(image._embedded.specificNode?.names[0], true)
    const licenseLong = useLicenseText(image._links.license.href)
    const licenseShort = useLicenseText(image._links.license.href, true)
    const keywords = useMemo(
        () =>
            Array.from(
                new Set(
                    [
                        "clip art",
                        "clipart",
                        "Creative Commons",
                        "free art",
                        "illustration",
                        "silhouette",
                        `${nameShort} silhouette`,
                        ...Array.from(
                            new Set<string>(
                                image._embedded.nodes?.reduce<readonly string[]>(
                                    (prev, node) => [
                                        ...prev,
                                        ...node.names.map(nomen => stringifyNomen(shortenNomen(nomen))),
                                    ],
                                    [],
                                ),
                            ),
                        ),
                    ].map(s => s.toLowerCase()),
                ),
            )
                .sort()
                .join(","),
        [image._embedded.nodes, nameShort],
    )
    const title = useMemo(
        () => `${nameShort}${image.attribution ? ` by ${image.attribution}` : ""} (${licenseShort}) - PhyloPic`,
        [image.attribution, licenseShort, nameShort],
    )
    const description = useMemo(
        () =>
            `A free silhouette image of ${nameLong}${
                image.attribution ? ` by ${image.attribution}` : ""
            } (License: ${licenseLong}).`,
        [image.attribution, licenseLong, nameLong],
    )
    const lineageNodeHRef = useMemo(() => {
        if (!image._embedded.nodes?.length) {
            return null
        }
        const node = image._embedded.nodes[image._embedded.nodes.length - 1]
        if (!node._links.parentNode) {
            return null
        }
        return node._links.self.href
    }, [image._embedded.nodes])
    const openGraph = useOpenGraphForImage(image)
    return (
        <>
            <NextSeo
                additionalMetaTags={[
                    ...(image.attribution ? [{ content: image.attribution, name: "author" }] : []),
                    { name: "keywords", content: keywords },
                ]}
                additionalLinkTags={[
                    { href: image._links.contributor.href, rel: "author" },
                    { href: image._links.license.href, rel: "license" },
                ]}
                canonical={`${process.env.NEXT_PUBLIC_WWW_URL}${getImageHRef(image._links.self)}`}
                description={description}
                openGraph={openGraph}
                title={title}
            />
            <VisualArtworkSchemaScript image={image} />
            <Container>
                <header>
                    <Breadcrumbs
                        items={[
                            { children: "Home", href: "/" },
                            { children: "Silhouette Images", href: "/images" },
                            {
                                children: (
                                    <strong>
                                        <NomenView
                                            value={image._embedded.specificNode?.names?.[0]}
                                            short
                                            defaultText="Silhouette"
                                        />
                                        {image.attribution && ` by ${image.attribution}`}
                                    </strong>
                                ),
                            },
                        ]}
                    />
                    <HeaderNav
                        buttons={[
                            isInCollection
                                ? null
                                : {
                                      children: "Add to Collection ＋",
                                      key: "collection",
                                      onClick: () => {
                                          customEvents.collectImage(image)
                                          customEvents.clickLink(
                                              "add_to_collection",
                                              "",
                                              "Add to Collection ＋",
                                              "button",
                                          )
                                          dispatch({
                                              type: "ADD_TO_CURRENT_COLLECTION",
                                              payload: { type: "image", entity: image },
                                          })
                                      },
                                      type: "button" as const,
                                  },
                            lineageNodeHRef
                                ? {
                                      children: "View Lineage →",
                                      key: "lineage",
                                      href: extractPath(lineageNodeHRef) + "/lineage",
                                      onClick: () => {
                                          customEvents.clickLink(
                                              "view_lineage",
                                              extractPath(lineageNodeHRef) + "/lineage",
                                              "View Lineage →",
                                              "button",
                                          )
                                      },
                                      type: "anchor" as const,
                                  }
                                : null,
                        ].filter(isDefined)}
                        headerLevel={1}
                        header={
                            <>
                                <NomenView
                                    value={image._embedded.specificNode?.names?.[0]}
                                    short
                                    defaultText="Silhouette"
                                />
                                {image.attribution && ` by ${image.attribution}`}
                            </>
                        }
                    />
                    <table>
                        <tbody>
                            <tr>
                                <th>License</th>
                                <td>
                                    <LicenseView value={image._links.license.href} />
                                </td>
                            </tr>
                            <tr>
                                <th>Uploaded</th>
                                <td>
                                    <TimestampView value={image.created} /> by{" "}
                                    <Link
                                        href={getContributorHRef(image._links.contributor)}
                                        onClick={() =>
                                            customEvents.clickContributorLink("uploaded_by", {
                                                _links: { self: image._links.contributor },
                                            })
                                        }
                                        rel="author"
                                    >
                                        {image._links.contributor.title}
                                    </Link>
                                </td>
                            </tr>
                            {image._embedded.specificNode && (
                                <tr>
                                    <th>Taxon</th>
                                    <td>
                                        <Link
                                            href={getNodeHRef(image._links.specificNode)}
                                            onClick={() =>
                                                image._embedded.specificNode
                                                    ? customEvents.clickNodeLink("taxon", image._embedded.specificNode)
                                                    : undefined
                                            }
                                            rel="subject"
                                        >
                                            <NomenView value={image._embedded.specificNode.names[0]} />
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <NameList
                        header="Names for Subject Matter"
                        names={
                            image._embedded.nodes?.reduce<readonly Nomen[]>(
                                (prev, node) => [...prev, ...node.names],
                                [],
                            ) ?? []
                        }
                    />
                </header>
                <br />
                <ImageRasterView value={image} />
                {image.sponsor && (
                    <section>
                        <p style={{ textAlign: "center" }}>
                            <em>
                                This silhouette&rsquo;s inclusion in <SiteTitle /> has been sponsored by{" "}
                                <strong>{image.sponsor}</strong>.
                            </em>
                        </p>
                    </section>
                )}
                <section>
                    <h2>Download Files</h2>
                    <section>
                        <h3>General Notes on Usage</h3>
                        <LicenseDetailsView value={image} />
                    </section>
                    <ImageFilesView value={image} />
                    <DonationPromo />
                </section>
            </Container>
        </>
    )
}
export default PageComponent
export const getStaticPaths = createStaticPathsGetter("/images")
export const getStaticProps: GetStaticProps<Props, EntityPageQuery> = async context => {
    const { slug, uuid } = context.params ?? {}
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    const key = process.env.NEXT_PUBLIC_API_URL + "/images/" + uuid + createSearch(IMAGE_QUERY)
    const result = await fetchResult<ImageWithEmbedded>(key)
    if (result.status !== "success") {
        return getStaticPropsResult(result)
    }
    if (getImageSlug(result.data._links.self.title) !== slug || result.data.uuid !== uuid) {
        return {
            redirect: {
                destination: `${process.env.NEXT_PUBLIC_WWW_URL}/${getImageHRef(result.data._links.self)}`,
                permanent: result.data.uuid !== uuid,
            },
        }
    }
    const { build } = result.data
    return {
        props: {
            build,
            fallback: compressFallback({
                [unstable_serialize(addBuildToURL(key, build))]: result.data,
            }),
            uuid,
        },
        revalidate: 3600,
    }
}
