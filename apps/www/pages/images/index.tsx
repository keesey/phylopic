import { ImageListParameters, ImageWithEmbedded, List } from "@phylopic/api-models"
import { BuildContainer } from "@phylopic/utils-api"
import type { NextPage } from "next"
import React from "react"
import { SWRConfig } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import ImageLicenseControls from "~/licenses/ImageLicenseControls"
import ImageLicensePaginator from "~/licenses/ImageLicensePaginator"
import LicenseTypeFilterContainer from "~/licenses/LicenseFilterTypeContainer"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import Breadcrumbs from "~/ui/Breadcrumbs"
import Loader from "~/ui/Loader"
import PageLoader from "~/ui/PageLoader"
import SearchOverlay from "~/ui/SearchOverlay"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import ImageListView from "~/views/ImageListView"
export type ImageFilter = Pick<ImageListParameters, "filter_license_by" | "filter_license_nc" | "filter_license_sa">
export type Props = {
    fallback: PublicConfiguration["fallback"]
} & Pick<List, "build">
const PageComponent: NextPage<Props> = ({ build, fallback }) => {
    return (
        <SWRConfig value={{ fallback }}>
            <BuildContainer initialValue={build}>
                <LicenseTypeFilterContainer>
                    <PageLoader />
                    <PageHead
                        title="PhyloPic: Silhouette Images"
                        url="https://www.phylopic.org/images/"
                        description="Browse all the free silhouette images in PhyloPic."
                    />
                    <SearchContainer>
                        <header>
                            <SiteNav />
                        </header>
                        <main>
                            <SearchOverlay>
                                <header>
                                    <Breadcrumbs
                                        items={[
                                            { children: "Home", href: "/" },
                                            { children: <strong>Silhouette Images</strong> },
                                        ]}
                                    />
                                    <h1>Silhouette Images</h1>
                                </header>
                                <ImageLicensePaginator>
                                    {(items, total) => (
                                        <>
                                            <ImageLicenseControls total={total} />
                                            <br />
                                            {isNaN(total) && <Loader key="loader" />}
                                            <ImageListView value={items} />
                                        </>
                                    )}
                                </ImageLicensePaginator>
                            </SearchOverlay>
                        </main>
                        <SiteFooter />
                    </SearchContainer>
                </LicenseTypeFilterContainer>
            </BuildContainer>
        </SWRConfig>
    )
}
export default PageComponent
export const getStaticProps = createListStaticPropsGetter<ImageWithEmbedded>("/images", { embed_specificNode: true })
