import {
    Contributor,
    ContributorListParameters,
    ImageListParameters,
    ImageWithEmbedded,
    List,
    Page,
    PageWithEmbedded,
} from "@phylopic/api-models"
import { createSearch, isDefined, isUUIDv4, Query, UUID } from "@phylopic/utils"
import type { GetStaticPaths, GetStaticPathsResult, GetStaticProps, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
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
import extractUUIDv4 from "~/routes/extractUUID"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import DataContainer from "~/swr/data/DataContainer"
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
                <DataContainer endpoint={process.env.NEXT_PUBLIC_API_URL + "/contributors/" + uuid}>
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
                                            contributor as Contributor | undefined,
                                        )}`}
                                        url={`https://www.phylopic.org/contributors/${encodeURIComponent(uuid)}`}
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
                                                                <ContributorNameView
                                                                    value={contributor as Contributor | undefined}
                                                                />
                                                            </strong>
                                                        ),
                                                    },
                                                ]}
                                            />
                                            <h1>
                                                Silhouette Images Contributed by{" "}
                                                <ContributorNameView value={contributor as Contributor | undefined} />
                                            </h1>
                                            <ContributorDetailsView value={contributor as Contributor | undefined} />
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
                </DataContainer>
            </BuildContainer>
        </SWRConfig>
    )
}
export default PageComponent
type PageQuery = ParsedUrlQuery & { uuid: UUID }
export const getStaticPaths: GetStaticPaths<PageQuery> = async () => {
    const parameters: ContributorListParameters & Query = { page: "0" }
    const response = await fetchData<Page>(process.env.NEXT_PUBLIC_API_URL + "/contributors" + createSearch(parameters))
    if (!response.ok) {
        console.error(response)
        return {
            fallback: "blocking",
            paths: [],
        }
    }
    const paths: GetStaticPathsResult<PageQuery>["paths"] =
        response.data._links.items
            .map(link => extractUUIDv4(link.href))
            .filter(isDefined)
            .map(uuid => ({
                params: { uuid },
            })) ?? []
    return {
        fallback: "blocking",
        paths,
    }
}
export const getStaticProps: GetStaticProps<Props, PageQuery> = async context => {
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
