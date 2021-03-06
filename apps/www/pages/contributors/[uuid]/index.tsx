import { Contributor, ImageListParameters, ImageWithEmbedded, List, PageWithEmbedded } from "@phylopic/api-models"
import { ContributorContainer } from "@phylopic/ui"
import { createSearch, isUUIDv4, Query } from "@phylopic/utils"
import { addBuildToURL, BuildContainer, fetchData, fetchResult } from "@phylopic/utils-api"
import type { GetStaticProps, NextPage } from "next"
import { useMemo } from "react"
import { SWRConfig, unstable_serialize } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import ImageLicenseControls from "~/licenses/ImageLicenseControls"
import ImageLicensePaginator from "~/licenses/ImageLicensePaginator"
import LicenseTypeFilterContainer from "~/licenses/LicenseFilterTypeContainer"
import PageHead from "~/metadata/PageHead"
import PersonSchemaScript from "~/metadata/SchemaScript/PersonSchemaScript"
import getContributorName from "~/models/getContributorName"
import SearchContainer from "~/search/SearchContainer"
import createStaticPathsGetter from "~/ssg/createListStaticPathsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import Breadcrumbs from "~/ui/Breadcrumbs"
import Loader from "~/ui/Loader"
import PageLoader from "~/ui/PageLoader"
import SearchOverlay from "~/ui/SearchOverlay"
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
                                        description={`All free silhouette images that have been contributed to PhyloPic by ${getContributorName(
                                            contributor,
                                        )}.`}
                                        socialImage={
                                            (images[0] as ImageWithEmbedded)?._links["http://ogp.me/ns#image"] ?? null
                                        }
                                        title={`PhyloPic: Silhouette Images Contributed by ${getContributorName(
                                            contributor,
                                        )}`}
                                        url={`https://www.phylopic.org/contributors/${uuid}`}
                                    >
                                        {contributor && <PersonSchemaScript contributor={contributor} />}
                                    </PageHead>
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
    const contributorKey = process.env.NEXT_PUBLIC_API_URL + "/contributors/" + uuid
    const listImagesKey = process.env.NEXT_PUBLIC_API_URL + "/images" + createSearch(imagesQuery)
    const [listImagesResponse, contributorResult] = await Promise.all([
        fetchData<List>(listImagesKey),
        fetchResult<Contributor>(contributorKey),
    ])
    if (contributorResult.status !== "success") {
        return getStaticPropsResult(contributorResult)
    }
    const build = contributorResult.data.build
    const props: Props = {
        build: contributorResult.data.build,
        fallback: {
            [unstable_serialize(addBuildToURL(contributorKey, build))]: contributorResult.data,
        },
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
