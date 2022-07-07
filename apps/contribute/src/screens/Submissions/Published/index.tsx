import { ImageListParameters, ImageWithEmbedded } from "@phylopic/api-models"
import { ImageThumbnailView, Loader, NumberView, PaginationContainer } from "@phylopic/ui"
import { Query } from "@phylopic/utils"
import { FC, useMemo } from "react"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import Banner from "~/ui/Banner"
import SiteTitle from "~/ui/SiteTitle"
const Published: FC = () => {
    const uuid = useContributorUUID()
    const query = useMemo<(ImageListParameters & Query) | undefined>(
        () => uuid ? { embed_specificNode: "true", filter_contributor: uuid } : undefined,
        [uuid],
    )
    if (!query) {
        return (
            <section key="main">
                <p key="header">Published images.</p>
                <Banner key="banner">
                    <Loader color="#ffffff" />
                </Banner>
            </section>
        )
    }
    return (
        <section key="main">
            <PaginationContainer endpoint={`${process.env.NEXT_PUBLIC_API_URL}/images`} query={query}>
                {(items, total) =>
                    <>
                        <p key="header">
                            {total === 0 && <>You do not currently have any published images on <SiteTitle />.</>}
                            {total !== 0 && <>You have <NumberView value={total} /> published image{total === 1 ? "" : "s"} on <SiteTitle />.</>}
                        </p>
                        <Banner key="banner">
                            {(items as ImageWithEmbedded[]).map(item => (
                                <a
                                    href={`https://${
                                        process.env.NEXT_PUBLIC_WWW_DOMAIN
                                    }/images/${encodeURIComponent(item.uuid)}`}
                                >
                                    <ImageThumbnailView key={item.uuid} value={item} />
                                </a>
                            ))}
                        </Banner>
                    </>
                }
            </PaginationContainer>
        </section>
    )
}
export default Published
