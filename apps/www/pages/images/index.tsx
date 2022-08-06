import { ImageListParameters, ImageWithEmbedded } from "@phylopic/api-models"
import type { NextPage } from "next"
import ImageLicenseControls from "~/licenses/ImageLicenseControls"
import ImageLicensePaginator from "~/licenses/ImageLicensePaginator"
import LicenseTypeFilterContainer from "~/licenses/LicenseFilterTypeContainer"
import PageHead from "~/metadata/PageHead"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import Breadcrumbs from "~/ui/Breadcrumbs"
import Loader from "~/ui/Loader"
import ImageListView from "~/views/ImageListView"
export type ImageFilter = Pick<ImageListParameters, "filter_license_by" | "filter_license_nc" | "filter_license_sa">
type Props = Omit<PageLayoutProps, "children">
const PageComponent: NextPage<Props> = props => {
    return (
        <PageLayout {...props}>
            <PageHead
                title="PhyloPic: Silhouette Images"
                url="https://www.phylopic.org/images/"
                description="Browse all the free silhouette images in PhyloPic."
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
                            <br />
                            {isNaN(total) && <Loader key="loader" />}
                            <ImageListView value={items} />
                        </>
                    )}
                </ImageLicensePaginator>
            </LicenseTypeFilterContainer>
        </PageLayout>
    )
}
export default PageComponent
export const getStaticProps = createListStaticPropsGetter<ImageWithEmbedded>("/images", { embed_specificNode: true })
