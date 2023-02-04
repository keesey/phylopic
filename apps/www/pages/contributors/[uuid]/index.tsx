import { Contributor, ImageListParameters, ImageWithEmbedded, List, PageWithEmbedded } from "@phylopic/api-models"
import { ContributorContainer, Loader } from "@phylopic/ui"
import { createSearch, isUUIDv4, Query, UUID } from "@phylopic/utils"
import { addBuildToURL, fetchData, fetchResult } from "@phylopic/utils-api"
import type { GetStaticProps, NextPage } from "next"
import { NextSeo } from "next-seo"
import { FC, useMemo } from "react"
import { unstable_serialize } from "swr"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import ImageLicenseControls from "~/licenses/ImageLicenseControls"
import ImageLicensePaginator from "~/licenses/ImageLicensePaginator"
import LicenseTypeFilterContainer from "~/licenses/LicenseFilterTypeContainer"
import useOpenGraphImages from "~/metadata/getOpenGraphImages"
import PersonSchemaScript from "~/metadata/SchemaScript/PersonSchemaScript"
import getContributorName from "~/models/getContributorName"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import createStaticPathsGetter from "~/ssg/createListStaticPathsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import Breadcrumbs from "~/ui/Breadcrumbs"
import ContributorDetailsView from "~/views/ContributorDetailsView"
import ContributorNameView from "~/views/ContributorNameView"
import ImageListView from "~/views/ImageListView"
type Props = Omit<PageLayoutProps, "children"> & { uuid: UUID }
const PageComponent: NextPage<Props> = ({ uuid, ...pageLayoutProps }) => {
    return (
        <>
            <PageLayout {...pageLayoutProps}>
                <ContributorContainer uuid={uuid}>
                    {contributor => (contributor ? <Content contributor={contributor} /> : null)}
                </ContributorContainer>
            </PageLayout>
        </>
    )
}
export default PageComponent
const Content: FC<{ contributor: Contributor }> = ({ contributor }) => {
    const imagesQuery = useMemo(
        () => ({ filter_contributor: contributor.uuid, embed_specificNode: "true" } as ImageListParameters & Query),
        [contributor.uuid],
    )
    return (
        <LicenseTypeFilterContainer>
            <ImageLicensePaginator query={imagesQuery} hideControls>
                {images => <Seo contributor={contributor} images={images} />}
            </ImageLicensePaginator>
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
                    Silhouette Images Contributed by <ContributorNameView value={contributor} />
                </h1>
                <ContributorDetailsView value={contributor} />
            </header>
            <ImageLicensePaginator query={imagesQuery}>
                {(images, totalImages) => (
                    <>
                        <ImageLicenseControls total={totalImages} />
                        {isNaN(totalImages) && <Loader key="loader" />}
                        <br />
                        <ImageListView key="images" value={images} />
                    </>
                )}
            </ImageLicensePaginator>
        </LicenseTypeFilterContainer>
    )
}
const Seo: FC<{ contributor: Contributor; images: readonly ImageWithEmbedded[] }> = ({ contributor, images }) => {
    const openGraphImages = useOpenGraphImages(images[0])
    const name = useMemo(() => getContributorName(contributor), [contributor])
    return (
        <>
            <NextSeo
                canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/contributors/${encodeURIComponent(contributor.uuid)}`}
                description={`All free silhouette images that have been contributed to PhyloPic by ${name}.`}
                openGraph={{ images: openGraphImages }}
                title={`PhyloPic: Silhouette Images Contributed by ${name}`}
            />
            <PersonSchemaScript contributor={contributor} />
        </>
    )
}
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
        props.fallback![unstable_serialize(addBuildToURL(listImagesKey, build))] = listImagesResponse.data
        if (listImagesResponse.data.totalItems > 0) {
            const getImagesPageKey = (page: number) =>
                process.env.NEXT_PUBLIC_API_URL +
                "/images" +
                createSearch({ ...imagesQuery, build, embed_items: true, embed_specificNode: true, page })
            const imagesPageResponse = await fetchData<PageWithEmbedded<ImageWithEmbedded>>(getImagesPageKey(0))
            if (imagesPageResponse.ok) {
                props.fallback![unstable_serialize_infinite(getImagesPageKey)] = [imagesPageResponse.data]
            }
        }
    }
    return { props, revalidate: 3600 }
}
