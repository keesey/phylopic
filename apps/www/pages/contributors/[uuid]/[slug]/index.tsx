import { Contributor, ImageListParameters, ImageWithEmbedded, List, PageWithEmbedded } from "@phylopic/api-models"
import { ContributorContainer, Loader } from "@phylopic/client-components"
import { createSearch, isUUIDv4, Query, UUID } from "@phylopic/utils"
import { addBuildToURL, fetchData, fetchResult } from "@phylopic/utils-api"
import type { Compressed } from "compress-json"
import type { GetStaticProps, NextPage } from "next"
import { NextSeo } from "next-seo"
import { FC, useMemo } from "react"
import { SWRConfiguration, unstable_serialize } from "swr"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import ImageLicenseControls from "~/licenses/ImageLicenseControls"
import ImageLicensePaginator from "~/licenses/ImageLicensePaginator"
import LicenseTypeFilterContainer from "~/licenses/LicenseFilterTypeContainer"
import PersonSchemaScript from "~/metadata/SchemaScript/PersonSchemaScript"
import useOpenGraphForImage from "~/metadata/useOpenGraphForImage"
import getContributorName from "~/models/getContributorName"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import getContributorHRef from "~/routes/getContributorHRef"
import getContributorSlug from "~/routes/getContributorSlug"
import createStaticPathsGetter from "~/ssg/createListStaticPathsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import CompressedSWRConfig from "~/swr/CompressedSWRConfig"
import compressFallback from "~/swr/compressFallback"
import Breadcrumbs from "~/ui/Breadcrumbs"
import Container from "~/ui/Container"
import ContributorDetailsView from "~/views/ContributorDetailsView"
import ContributorNameView from "~/views/ContributorNameView"
import ImageListView from "~/views/ImageListView"
type Props = Omit<PageLayoutProps, "children"> & {
    fallback?: Compressed
    uuid: UUID
}
const PageComponent: NextPage<Props> = ({ fallback, uuid, ...props }) => {
    return (
        <CompressedSWRConfig fallback={fallback}>
            <PageLayout {...props}>
                <Container>
                    <ContributorContainer uuid={uuid}>
                        {contributor => (contributor ? <Content contributor={contributor} /> : null)}
                    </ContributorContainer>
                </Container>
            </PageLayout>
        </CompressedSWRConfig>
    )
}
export default PageComponent
const Content: FC<{ contributor: Contributor }> = ({ contributor }) => {
    const imagesQuery = useMemo(
        () => ({ filter_contributor: contributor.uuid }) as ImageListParameters & Query,
        [contributor.uuid],
    )
    return (
        <section>
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
                            {isNaN(totalImages) && <Loader />}
                            <br />
                            <ImageListView value={images} />
                        </>
                    )}
                </ImageLicensePaginator>
            </LicenseTypeFilterContainer>
        </section>
    )
}
const Seo: FC<{ contributor: Contributor; images: readonly ImageWithEmbedded[] }> = ({ contributor, images }) => {
    const openGraph = useOpenGraphForImage(images[0])
    const name = useMemo(() => getContributorName(contributor), [contributor])
    return (
        <>
            <NextSeo
                additionalMetaTags={[{ name: "keywords", content: `silhouettes,${contributor.name}` }]}
                canonical={`${process.env.NEXT_PUBLIC_WWW_URL}${getContributorHRef(contributor._links.self)}`}
                description={`All free silhouette images that have been contributed to PhyloPic by ${name}.`}
                openGraph={openGraph}
                title={`Silhouette Images Contributed by ${name} to PhyloPic`}
            />
            <PersonSchemaScript contributor={contributor} />
        </>
    )
}
export const getStaticPaths = createStaticPathsGetter("/contributors")
export const getStaticProps: GetStaticProps<Props, EntityPageQuery> = async context => {
    const { slug, uuid } = context.params ?? {}
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
    if (getContributorSlug(contributorResult.data._links.self.title) !== slug || contributorResult.data.uuid !== uuid) {
        return {
            redirect: {
                destination: `${process.env.NEXT_PUBLIC_WWW_URL}/${getContributorHRef(
                    contributorResult.data._links.self,
                )}`,
                permanent: contributorResult.data.uuid !== uuid,
            },
        }
    }
    const build = contributorResult.data.build
    const fallback: NonNullable<SWRConfiguration["fallback"]> = {
        [unstable_serialize(addBuildToURL(contributorKey, build))]: contributorResult.data,
    }
    if (listImagesResponse.ok) {
        fallback[unstable_serialize(addBuildToURL(listImagesKey, build))] = listImagesResponse.data
        if (listImagesResponse.data.totalItems > 0) {
            const getImagesPageKey = (page: number) =>
                process.env.NEXT_PUBLIC_API_URL +
                "/images" +
                createSearch({ ...imagesQuery, build, embed_items: true, page })
            const imagesPageResponse = await fetchData<PageWithEmbedded<ImageWithEmbedded>>(getImagesPageKey(0))
            if (imagesPageResponse.ok) {
                fallback[unstable_serialize_infinite(getImagesPageKey)] = [imagesPageResponse.data]
            }
        }
    }
    return {
        props: {
            build,
            fallback: compressFallback(fallback),
            uuid,
        },
        revalidate: 3600,
    }
}
