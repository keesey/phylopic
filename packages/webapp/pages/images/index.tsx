import { ImageListParameters, ImageWithEmbedded, List, PageWithEmbedded } from "@phylopic/api-models"
import { createSearch } from "@phylopic/utils"
import type { GetStaticProps, NextPage } from "next"
import React from "react"
import { SWRConfig, unstable_serialize } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import addBuildToURL from "~/builds/addBuildToURL"
import BuildContainer from "~/builds/BuildContainer"
import fetchData from "~/fetch/fetchData"
import fetchResult from "~/fetch/fetchResult"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import ImageLicenseControls from "~/licenses/ImageLicenseControls"
import ImageLicensePaginator from "~/licenses/ImageLicensePaginator"
import LicenseTypeFilterContainer from "~/licenses/LicenseFilterTypeContainer"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import Breadcrumbs from "~/ui/Breadcrumbs"
import Loader from "~/ui/Loader"
import PageLoader from "~/ui/PageLoader"
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
                    <PageHead title="PhyloPic: Silhouette Images" url="https://www.phylopic.org/images/" />
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
export const getStaticProps: GetStaticProps<Props, {}> = async () => {
    const listKey = process.env.NEXT_PUBLIC_API_URL + "/images"
    const listResponse = await fetchResult<List>(listKey)
    if (listResponse.status !== "success") {
        return getStaticPropsResult(listResponse)
    }
    const build = listResponse.data.build
    const props: Props = {
        build,
        fallback: {
            [unstable_serialize(addBuildToURL(listKey, build))]: listResponse.data,
        },
    }
    if (listResponse.data.totalPages > 0) {
        const getPageKey = (page: number) =>
            listKey +
            createSearch({
                build,
                embed_items: true,
                embed_specificNode: true,
                page,
            })
        const pageResponse = await fetchData<PageWithEmbedded<ImageWithEmbedded>>(getPageKey(0))
        if (pageResponse.ok) {
            props.fallback[unstable_serialize_infinite(getPageKey)] = [pageResponse.data]
        }
    }
    return { props }
}
