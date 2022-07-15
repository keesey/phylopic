import { ImageListParameters, ImageWithEmbedded } from "@phylopic/api-models"
import {
    AnchorLink,
    ImageThumbnailView,
    Loader,
    NumberView,
    PaginationContainer,
    PaginationContainerProps,
} from "@phylopic/ui"
import { Query } from "@phylopic/utils"
import { FC, useMemo } from "react"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import Banner from "~/ui/Banner"
import SiteTitle from "~/ui/SiteTitle"
const SWR_CONFIGS: PaginationContainerProps["swrConfigs"] = {
    list: {
        revalidateIfStale: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    },
    page: {
        revalidateFirstPage: true,
        revalidateIfStale: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    },
}
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
        <PaginationContainer
            endpoint={`${process.env.NEXT_PUBLIC_API_URL}/images`}
            maxPages={1}
            query={query}
            swrConfigs={SWR_CONFIGS}
        >
            {(items, total) => (
                <>
                    <p key="header" className="dialogue">
                        {isNaN(total) && <>Loading published images…</>}
                        {total === 0 && (
                            <>
                                You do not currently have any published images on <SiteTitle />.
                            </>
                        )}
                        {total > 0 && (
                            <>
                                You have <NumberView value={total} /> published image{total === 1 ? "" : "s"} on{" "}
                                <SiteTitle />.{" "}
                                <AnchorLink href="/images" className="text">
                                    See them all.
                                </AnchorLink>
                            </>
                        )}
                    </p>
                    <div className="thumbnails">
                        <Banner key="banner">
                            {(items as ImageWithEmbedded[]).map(item => (
                                <AnchorLink key={item.uuid} href={`/images/${encodeURIComponent(item.uuid)}`}>
                                    <ImageThumbnailView value={item} />
                                </AnchorLink>
                            ))}
                            {total > 0 && total > items.length && (
                                <AnchorLink className="text" href="/images">
                                    See More →
                                </AnchorLink>
                            )}
                        </Banner>
                    </div>
                </>
            )}
        </PaginationContainer>
    )
}
export default Published
