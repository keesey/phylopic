import { ImageListParameters, ImageParameters } from "@phylopic/api-models"
import { Loader } from "@phylopic/ui"
import { EMPTY_UUID, isUUIDish, Query, UUIDish } from "@phylopic/utils"
import type { GetStaticPaths, GetStaticProps, GetStaticPropsResult, NextPage } from "next"
import ImageCollectionUsage from "~/licenses/ImageCollectionUsage"
import ImageLicensePaginator from "~/licenses/ImageLicensePaginator"
import LicenseTypeFilterContainer from "~/licenses/LicenseFilterTypeContainer"
import PageHead from "~/metadata/PageHead"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import Breadcrumbs from "~/ui/Breadcrumbs"
import ImageListView from "~/views/ImageListView"
const IMAGE_QUERY: Omit<ImageParameters, "uuid"> & Query = {
    embed_contributor: "true",
    embed_nodes: "true",
    embed_specificNode: "true",
}
export type ImageFilter = Pick<ImageListParameters, "filter_license_by" | "filter_license_nc" | "filter_license_sa">
type Props = Omit<PageLayoutProps, "children"> & {
    uuid: UUIDish
}
const PageComponent: NextPage<Props> = props => {
    return (
        <PageLayout {...props}>
            <PageHead
                description="A collection of silhouette images from PhyloPic."
                title="PhyloPic: Silhouette Image Collection"
                url={`https://www.phylopic.org/imagesets/${encodeURIComponent(props.uuid)}`}
            />
            <header>
                <Breadcrumbs
                    items={[
                        { children: "Home", href: "/" },
                        { children: "Collections" },
                        { children: <strong>Silhouette Image Collection</strong> },
                    ]}
                />
                <h1>Silhouette Image Collection</h1>
            </header>
            {props.uuid === EMPTY_UUID && <p>This collection is empty.</p>}
            {props.uuid !== EMPTY_UUID && (
                <LicenseTypeFilterContainer>
                    <ImageLicensePaginator autoLoad query={{ filter_collection: props.uuid }}>
                        {(items, total) => (
                            <>
                                {total === 0 && <p>There are no silhouette images in this collection.</p>}
                                {total > 0 && (
                                    <>
                                        <ImageCollectionUsage items={items} total={total} uuid={props.uuid} />
                                        {isNaN(total) && <Loader key="loader" />}
                                        <br />
                                        <ImageListView value={items} />
                                    </>
                                )}
                            </>
                        )}
                    </ImageLicensePaginator>
                </LicenseTypeFilterContainer>
            )}
        </PageLayout>
    )
}
export default PageComponent
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        fallback: "blocking",
        paths: [],
    }
}
export const getStaticProps: GetStaticProps<Props, EntityPageQuery> = async context => {
    const { uuid } = context.params ?? {}
    if (!isUUIDish(uuid)) {
        return { notFound: true }
    }
    const result = await createListStaticPropsGetter("/images", { ...IMAGE_QUERY, filter_collection: uuid })({
        ...context,
        params: {},
    })
    if (!(result as { props: unknown }).props) {
        return result as GetStaticPropsResult<Props> & { props: undefined }
    }
    return {
        ...result,
        props: {
            ...(result as { props: Omit<Props, "uuid"> }).props,
            uuid,
        },
    }
}
