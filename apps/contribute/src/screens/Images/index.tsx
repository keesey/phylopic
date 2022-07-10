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
import clsx from "clsx"
import { FC, useMemo } from "react"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import FullScreen from "~/pages/screenTypes/FullScreen"
import SiteTitle from "~/ui/SiteTitle"
import styles from "./index.module.scss"
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
const Images: FC = () => {
    const uuid = useContributorUUID()
    const query = useMemo<(ImageListParameters & Query) | undefined>(
        () => (uuid ? { embed_specificNode: "true", filter_contributor: uuid } : undefined),
        [uuid],
    )
    if (!query) {
        return <Loader />
    }
    return (
        <FullScreen>
            <PaginationContainer
                endpoint={`${process.env.NEXT_PUBLIC_API_URL}/images`}
                query={query}
                swrConfigs={SWR_CONFIGS}
            >
                {(items, total) => (
                    <>
                        <p className="dialogue">
                            {total === 0 && (
                                <>
                                    You do not currently have any published images on <SiteTitle />.
                                </>
                            )}
                            {total !== 0 && (
                                <>
                                    You have <NumberView value={total} /> published image{total === 1 ? "" : "s"} on{" "}
                                    <SiteTitle />. Click on any to edit them.
                                </>
                            )}
                        </p>
                        <p>
                            <AnchorLink href="/" className="text">
                                ← Return to Home Screen.
                            </AnchorLink>
                        </p>
                        <div className={clsx(styles.imageGrid, "thumbnails")}>
                            {(items as ImageWithEmbedded[]).map(item => (
                                <AnchorLink key={item.uuid} href={`/images/${encodeURIComponent(item.uuid)}`}>
                                    <ImageThumbnailView value={item} />
                                </AnchorLink>
                            ))}
                        </div>
                    </>
                )}
            </PaginationContainer>
        </FullScreen>
    )
}
export default Images
