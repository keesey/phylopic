import { Contributor, ImageListParameters, ImageWithEmbedded, List, PageWithEmbedded } from "@phylopic/api-models"
import { ContributorContainer, Loader } from "@phylopic/ui"
import { createSearch, isUUIDv4, Query, UUID } from "@phylopic/utils"
import { addBuildToURL, fetchData, fetchResult } from "@phylopic/utils-api"
import type { GetStaticProps, NextPage } from "next"
import { FC, useMemo } from "react"
import { unstable_serialize } from "swr"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import ImageLicenseControls from "~/licenses/ImageLicenseControls"
import ImageLicensePaginator from "~/licenses/ImageLicensePaginator"
import LicenseTypeFilterContainer from "~/licenses/LicenseFilterTypeContainer"
import PageHead from "~/metadata/PageHead"
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
        <PageLayout {...pageLayoutProps}>
            <ContributorContainer uuid={uuid}>
                {contributor => (contributor ? <Content contributor={contributor} /> : null)}
            </ContributorContainer>
        </PageLayout>
    )
}
const Content: FC<{ contributor: Contributor }> = ({ contributor }) => {
    const imagesQuery = useMemo(
        () => ({ filter_contributor: contributor.uuid, embed_specificNode: "true" } as ImageListParameters & Query),
        [contributor.uuid],
    )
    const name = useMemo(() => getContributorName(contributor), [contributor])
    return (
        <LicenseTypeFilterContainer>
            <ImageLicensePaginator query={imagesQuery} hideControls>
                {images => (
                    <PageHead
                        description={`All free silhouette images that have been contributed to PhyloPic by ${name}.`}
                        socialImage={(images[0] as ImageWithEmbedded)?._links["http://ogp.me/ns#image"] ?? null}
                        title={`PhyloPic: Silhouette Images Contributed by ${name}`}
                        url={`https://www.phylopic.org/contributors/${contributor.uuid}`}
                    >
                        <PersonSchemaScript contributor={contributor} />
                    </PageHead>
                )}
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
export default PageComponent
export const getStaticPaths = createStaticPathsGetter("/contributors")
export const getStaticProps: GetStaticProps<Props, EntityPageQuery> = async context => {
    const { uuid } = context.params ?? {}
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    const imagesQuery: ImageListParameters & Query = { filter_contributor: uuid }
    const contributorKey = "https://" + process.env.NEXT_PUBLIC_API_DOMAIN + "/contributors/" + uuid
    const listImagesKey = "https://" + process.env.NEXT_PUBLIC_API_DOMAIN + "/images" + createSearch(imagesQuery)
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
                "https://" +
                process.env.NEXT_PUBLIC_API_DOMAIN +
                "/images" +
                createSearch({ ...imagesQuery, build, embed_items: true, embed_specificNode: true, page })
            const imagesPageResponse = await fetchData<PageWithEmbedded<ImageWithEmbedded>>(getImagesPageKey(0))
            if (imagesPageResponse.ok) {
                props.fallback![unstable_serialize_infinite(getImagesPageKey)] = [imagesPageResponse.data]
            }
        }
    }
    return { props }
}
