import { ImageParameters, ImageWithEmbedded } from "@phylopic/api-models"
import { createSearch, isUUIDv4, Query } from "@phylopic/utils"
import type { GetStaticProps, NextPage } from "next"
import React, { useMemo } from "react"
import BuildContainer from "~/builds/BuildContainer"
import fetchResult from "~/fetch/fetchResult"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import useLicenseText from "~/hooks/useLicenseText"
import useNomenText from "~/hooks/useNomenText"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import createStaticPathsGetter from "~/ssg/createListStaticPathsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import AnchorLink from "~/ui/AnchorLink"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import ImageFilesView from "~/views/ImageFilesView"
import ImageRasterView from "~/views/ImageRasterView"
import LicenseDetailsView from "~/views/LicenseDetailsView"
import LicenseView from "~/views/LicenseView"
import NodeListView from "~/views/NodeListView"
import NomenView from "~/views/NomenView"
import TimestampView from "~/views/TimestampView"
export interface Props {
    image: ImageWithEmbedded
}
const PageComponent: NextPage<Props> = ({ image }) => {
    const nameShort = useNomenText(image._embedded.specificNode?.names[0], true)
    const licenseShort = useLicenseText(image._links.license.href, true)
    const title = useMemo(
        () => `PhyloPic: ${nameShort} by ${image.attribution ?? "Anonymous"} (${licenseShort})`,
        [image.attribution, licenseShort, nameShort],
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
                socialImage={image._links["http://ogp.me/ns#image"]}
                title={title}
                url={`https://www.phylopic.org/images/${image.uuid}`}
            >
                <meta key="meta:author" name="author" content={image.attribution ?? "Anonymous"} />
                <link key="link:author" rel="author" href={image._links.contributor.href} />
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
                            <h1>
                                <NomenView
                                    value={image._embedded.specificNode?.names?.[0]}
                                    short
                                    defaultText="Silhouette"
                                />
                                {" by "}
                                {image.attribution ?? "Anonymous"}
                            </h1>
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
                        {lineageNodeHRef && (
                            <div key="controls">
                                <AnchorLink href={lineageNodeHRef.split("?", 2)[0] + "/lineage"}>
                                    View Lineage
                                </AnchorLink>
                            </div>
                        )}
                        <ImageRasterView key="raster" value={image} />
                        <section key="download">
                            <h2>Download Files</h2>
                            <section>
                                <h3>General Notes on Usage</h3>
                                <LicenseDetailsView value={image} />
                            </section>
                            <ImageFilesView value={image} />
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
