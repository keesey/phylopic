import { ImageParameters, ImageWithEmbedded } from "@phylopic/api-models"
import { AnchorLink, TimestampView, useLicenseText, useNomenText } from "@phylopic/ui"
import { createSearch, extractPath, isUUIDv4, Query } from "@phylopic/utils"
import { BuildContainer, fetchResult } from "@phylopic/utils-api"
import type { GetStaticProps, NextPage } from "next"
import { useMemo } from "react"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import PageHead from "~/metadata/PageHead"
import VisualArtworkSchemaScript from "~/metadata/SchemaScript/VisualArtworkSchemaScript"
import DonationPromo from "~/promos/DonationPromo"
import SearchContainer from "~/search/SearchContainer"
import createStaticPathsGetter from "~/ssg/createListStaticPathsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import Breadcrumbs from "~/ui/Breadcrumbs"
import HeaderNav from "~/ui/HeaderNav"
import PageLoader from "~/ui/PageLoader"
import SearchOverlay from "~/ui/SearchOverlay"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import ImageFilesView from "~/views/ImageFilesView"
import ImageRasterView from "~/views/ImageRasterView"
import LicenseDetailsView from "~/views/LicenseDetailsView"
import LicenseView from "~/views/LicenseView"
import NodeListView from "~/views/NodeListView"
import NomenView from "~/views/NomenView"
export interface Props {
    image: ImageWithEmbedded
}
const PageComponent: NextPage<Props> = ({ image }) => {
    const nameLong = useNomenText(image._embedded.specificNode?.names[0])
    const nameShort = useNomenText(image._embedded.specificNode?.names[0], true)
    const licenseLong = useLicenseText(image._links.license.href)
    const licenseShort = useLicenseText(image._links.license.href, true)
    const title = useMemo(
        () => `PhyloPic: ${nameShort} by ${image.attribution ?? "Anonymous"} (${licenseShort})`,
        [image.attribution, licenseShort, nameShort],
    )
    const description = useMemo(
        () =>
            `A free silhouette image of ${nameLong} by ${image.attribution ?? "Anonymous"} (License: ${licenseLong}).`,
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
    return (
        <BuildContainer initialValue={image.build}>
            <PageLoader />
            <PageHead
                description={description}
                socialImage={image._links["http://ogp.me/ns#image"]}
                title={title}
                url={`https://www.phylopic.org/images/${image.uuid}`}
            >
                <meta key="meta:author" name="author" content={image.attribution ?? "Anonymous"} />
                <link key="link:contributor" rel="contributor" href={image._links.contributor.href} />
                <VisualArtworkSchemaScript image={image} />
            </PageHead>
            <SearchContainer>
                <header>
                    <SiteNav />
                </header>
                <main>
                    <SearchOverlay>
                        <header key="header">
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
                                                {" by "}
                                                {image.attribution ?? "Anonymous"}
                                            </strong>
                                        ),
                                    },
                                ]}
                            />
                            <HeaderNav
                                buttons={
                                    lineageNodeHRef
                                        ? [
                                              {
                                                  children: "View Lineage →",
                                                  key: "lineage",
                                                  href: extractPath(lineageNodeHRef) + "/lineage",
                                                  type: "anchor",
                                              },
                                          ]
                                        : []
                                }
                                headerLevel={1}
                                header={
                                    <>
                                        <NomenView
                                            value={image._embedded.specificNode?.names?.[0]}
                                            short
                                            defaultText="Silhouette"
                                        />
                                        {" by "}
                                        {image.attribution ?? "Anonymous"}
                                    </>
                                }
                            />
                            <table>
                                <tbody>
                                    <tr key="license">
                                        <th>License</th>
                                        <td>
                                            <LicenseView value={image._links.license.href} />
                                        </td>
                                    </tr>
                                    {image.sponsor && (
                                        <tr key="sponsor">
                                            <th>Sponsor</th>
                                            <td>{image.sponsor}</td>
                                        </tr>
                                    )}
                                    <tr key="uploaded">
                                        <th>Uploaded</th>
                                        <td>
                                            <TimestampView value={image.created} /> by{" "}
                                            {image._embedded.contributor && (
                                                <AnchorLink
                                                    href={`/contributors/${encodeURIComponent(
                                                        image._embedded.contributor.uuid,
                                                    )}`}
                                                >
                                                    {image._embedded.contributor.name || "Anonymous"}
                                                </AnchorLink>
                                            )}
                                        </td>
                                    </tr>
                                    {image._embedded.nodes && image._embedded.nodes.length > 0 && (
                                        <tr key="nodes">
                                            <th>Tax{image._embedded.nodes.length === 1 ? "on" : "a"}</th>
                                            <td>
                                                <NodeListView
                                                    short
                                                    value={[...image._embedded.nodes].reverse()}
                                                    variant="lineage"
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </header>
                        <br key="br" />
                        <ImageRasterView key="raster" value={image} />
                        <section key="download">
                            <h2>Download Files</h2>
                            <section>
                                <h3>General Notes on Usage</h3>
                                <LicenseDetailsView value={image} />
                            </section>
                            <ImageFilesView value={image} />
                            <DonationPromo />
                        </section>
                    </SearchOverlay>
                </main>
                <SiteFooter />
            </SearchContainer>
        </BuildContainer>
    )
}
export default PageComponent
export const getStaticPaths = createStaticPathsGetter("/images")
export const getStaticProps: GetStaticProps<Props, EntityPageQuery> = async context => {
    const { uuid } = context.params ?? {}
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    const parameters: Omit<ImageParameters, "uuid"> & Query = {
        embed_nodes: "true",
        embed_contributor: "true",
        embed_specificNode: "true",
    }
    const result = await fetchResult<ImageWithEmbedded>(
        process.env.NEXT_PUBLIC_API_URL + "/images/" + uuid + createSearch(parameters),
    )
    if (result.status !== "success") {
        return getStaticPropsResult(result)
    }
    return {
        props: { image: result.data },
    }
}
