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
        () => (uuid ? { embed_specificNode: "true", filter_contributor: uuid } : undefined),
        [uuid],
    )
    if (!query) {
        return (
            <section key="main">
                <p key="header" className="dialogue">
                    Published images.
                </p>
                <Banner key="banner">
                    <Loader />
                </Banner>
            </section>
        )
    }
    return (
        <section key="main">
            <PaginationContainer endpoint={`${process.env.NEXT_PUBLIC_API_URL}/images`} query={query}>
                {(items, total) => (
                    <>
                        <p key="header" className="dialogue">
                            {total === 0 && (
                                <>
                                    You do not currently have any published images on <SiteTitle />.
                                </>
                            )}
                            {total !== 0 && (
                                <>
                                    You have <NumberView value={total} /> published image{total === 1 ? "" : "s"} on{" "}
                                    <SiteTitle />.
                                    {uuid && (
                                        <>
                                            {" "}
                                            <a
                                                className="text"
                                                href={`https://${
                                                    process.env.NEXT_PUBLIC_WWW_DOMAIN
                                                }/contributors/${encodeURIComponent(uuid)}`}
                                            >
                                                Check out your gallery.
                                            </a>
                                        </>
                                    )}
                                </>
                            )}
                        </p>
                        <Banner key="banner">
                            {(items as ImageWithEmbedded[]).map(item => (
                                <a
                                    href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/images/${encodeURIComponent(
                                        item.uuid,
                                    )}`}
                                >
                                    <ImageThumbnailView key={item.uuid} value={item} />
                                </a>
                            ))}
                        </Banner>
                        {total > 0 && <p className="dialogue">Click on a silhouette if you want to edit it.</p>}
                    </>
                )}
            </PaginationContainer>
        </section>
    )
}
export default Published
