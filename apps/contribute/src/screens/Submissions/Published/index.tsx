import { Image, ImageListParameters } from "@phylopic/api-models"
import { PaginationContainer } from "@phylopic/ui"
import { Query } from "@phylopic/utils"
import { BuildContainer } from "@phylopic/utils-api"
import { FC, useMemo } from "react"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import SiteTitle from "~/ui/SiteTitle"
const Published: FC = () => {
    const uuid = useContributorUUID()
    const query = useMemo<ImageListParameters & Query>(() => (uuid ? { filter_contributor: uuid } : {}), [uuid])
    if (!uuid) {
        return null
    }
    return (
        <BuildContainer>
            <PaginationContainer endpoint={`${process.env.NEXT_PUBLIC_API_URL}/images`} query={query}>
                {(items, total) =>
                    items.length ? (
                        <>
                            <small>
                                {total} image{total === 1 ? "" : "s"}
                            </small>
                            <ul>
                                {(items as Image[]).map((item: Image) => (
                                    <li key={item.uuid}>{item.uuid}</li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>
                            You do not currently have any silhouettes on <SiteTitle />.
                        </p>
                    )
                }
            </PaginationContainer>
        </BuildContainer>
    )
}
export default Published
