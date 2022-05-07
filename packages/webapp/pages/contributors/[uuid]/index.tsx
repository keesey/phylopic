import { Contributor, ImageListParameters, ImageWithEmbedded, List, PageWithEmbedded } from "@phylopic/api-models"
import { createSearch, isUUIDv4, Query } from "@phylopic/utils"
import type { GetStaticProps, NextPage } from "next"
import React, { useMemo } from "react"
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
import getContributorName from "~/models/getContributorName"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import createStaticPathsGetter from "~/ssg/createListStaticPathsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import ContributorContainer from "~/swr/data/ContributorContainer"
import Breadcrumbs from "~/ui/Breadcrumbs"
import Loader from "~/ui/Loader"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import ContributorDetailsView from "~/views/ContributorDetailsView"
import ContributorNameView from "~/views/ContributorNameView"
import ImageListView from "~/views/ImageListView"
export type Props = {
    fallback: PublicConfiguration["fallback"]
} & Pick<Contributor, "build" | "uuid">
const PageComponent: NextPage<Props> = ({ build, fallback, uuid }) => {
    const imagesQuery = useMemo(
        () => ({ filter_contributor: uuid, embed_specificNode: "true" } as ImageListParameters & Query),
        [uuid],
    )
    return (
        <SWRConfig value={{ fallback }}>
            <BuildContainer initialValue={build}>
                <ContributorContainer uuid={uuid}>
                    {contributor => (
                        <LicenseTypeFilterContainer>
                            <PageLoader />
                            <ImageLicensePaginator query={imagesQuery} hideControls>
                                {images => (
                                    <PageHead
                                        socialImage={
                                            (images[0] as ImageWithEmbedded)._links["http://ogp.me/ns#image"] ?? null
                                        }
                                        title={`PhyloPic: Silhouette Images Contributed by ${getContributorName(
                                            contributor,
                                        )}`}
                                        url={`https://www.phylopic.org/contributors/${uuid}`}
                                    />
                                )}
                            </ImageLicensePaginator>
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
                                                    { children: "Contributors", href: "/contributors" },
                                                    {
                                                        children: (
                                                            <strong>
                                                                <ContributorNameView value={contributor} />
                                                            </strong>
                                                        ),
                                                    },
                                                ]}
                                            />
                                            <h1>
                                                Silhouette Images Contributed by{" "}
                                                <ContributorNameView value={contributor} />
                                            </h1>
                                            <ContributorDetailsView value={contributor} />
                                        </header>
                                        <ImageLicensePaginator query={imagesQuery}>
                                            {(images, totalImages) => (
                                                <>
                                                    <ImageLicenseControls total={totalImages} />
                                                    <br />
                                                    {isNaN(totalImages) && <Loader key="loader" />}
                                                    <ImageListView value={images} />
                                                </>
                                            )}
                                        </ImageLicensePaginator>
                                    </SearchOverlay>
                                </main>
                                <SiteFooter />
                            </SearchContainer>
                        </LicenseTypeFilterContainer>
                    )}
                </ContributorContainer>
            </BuildContainer>
        </SWRConfig>
    )
}
export default PageComponent
export const getStaticPaths = createStaticPathsGetter("/contributors")
export const getStaticProps: GetStaticProps<Props, EntityPageQuery> = async context => {
    const { uuid } = context.params ?? {}
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    const imagesQuery: ImageListParameters & Query = { filter_contributor: uuid }
    const listImagesKey = process.env.NEXT_PUBLIC_API_URL + "/images" + createSearch(imagesQuery)
    const [listImagesResponse, contributorResult] = await Promise.all([
        fetchData<List>(listImagesKey),
        fetchResult<Contributor>(process.env.NEXT_PUBLIC_API_URL + "/contributor/" + uuid),
    ])
    if (contributorResult.status !== "success") {
        return getStaticPropsResult(contributorResult)
    }
    const build = contributorResult.data.build
    const props: Props = {
        build: contributorResult.data.build,
        fallback: {},
        uuid,
    }
    if (listImagesResponse.ok) {
        props.fallback[unstable_serialize(addBuildToURL(listImagesKey, build))] = listImagesResponse.data
        if (listImagesResponse.data.totalItems > 0) {
            const getImagesPageKey = (page: number) =>
                process.env.NEXT_PUBLIC_API_URL +
                "/images" +
                createSearch({ ...imagesQuery, build, embed_items: true, embed_specificNode: true, page })
            const imagesPageResponse = await fetchData<PageWithEmbedded<ImageWithEmbedded>>(getImagesPageKey(0))
            if (imagesPageResponse.ok) {
                props.fallback[unstable_serialize_infinite(getImagesPageKey)] = [imagesPageResponse.data]
            }
        }
    }
    return { props }
}
