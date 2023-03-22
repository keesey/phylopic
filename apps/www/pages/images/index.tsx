import { ImageListParameters, ImageWithEmbedded } from "@phylopic/api-models"
import { Loader } from "@phylopic/ui"
import type { Compressed } from "compress-json"
import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import ImageLicenseControls from "~/licenses/ImageLicenseControls"
import ImageLicensePaginator from "~/licenses/ImageLicensePaginator"
import LicenseTypeFilterContainer from "~/licenses/LicenseFilterTypeContainer"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import CompressedSWRConfig from "~/swr/CompressedSWRConfig"
import Breadcrumbs from "~/ui/Breadcrumbs"
import ImageListView from "~/views/ImageListView"
export type ImageFilter = Pick<ImageListParameters, "filter_license_by" | "filter_license_nc" | "filter_license_sa">
type Props = Omit<PageLayoutProps, "children"> & {
    fallback?: Compressed
}
const PageComponent: NextPage<Props> = ({ fallback, ...props }) => {
    return (
        <CompressedSWRConfig fallback={fallback}>
            <PageLayout {...props}>
                <NextSeo
                    canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/images`}
                    description="Browse all the free silhouette images in PhyloPic."
                    title="PhyloPic: Silhouette Images"
                />
                <header>
                    <Breadcrumbs
                        items={[{ children: "Home", href: "/" }, { children: <strong>Silhouette Images</strong> }]}
                    />
                    <h1>Silhouette Images</h1>
                </header>
                <LicenseTypeFilterContainer>
                    <ImageLicensePaginator>
                        {(items, total) => (
                            <>
                                <ImageLicenseControls total={total} />
                                {isNaN(total) && <Loader key="loader" />}
                                <br />
                                <ImageListView value={items} />
                            </>
                        )}
                    </ImageLicensePaginator>
                </LicenseTypeFilterContainer>
            </PageLayout>
        </CompressedSWRConfig>
    )
}
export default PageComponent
export const getStaticProps = createListStaticPropsGetter<ImageWithEmbedded>("/images")
