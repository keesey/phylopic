import { Page, TitledLink, isPage } from "@phylopic/api-models"
import { S3Client } from "@aws-sdk/client-s3"
import getEntitiesJSONFromLinks from "../entities/getEntitiesJSONFromLinks"
import getS3EntityJSON from "../entities/getS3EntityJSON"
import getPageObjectJSONWithEmbedded from "./getPageObjectJSONWithEmbedded"

export type HydratedListPage = Readonly<{
    body: string
}>

const hydrateListPageFromS3 = async (
    client: S3Client,
    getPageKey: (pageIndex: number) => string,
    listPath: string,
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>,
    pageIndex: number,
    page: string,
): Promise<HydratedListPage | null> => {
    const linksBody = await getS3EntityJSON(client, getPageKey(pageIndex))
    if (linksBody === null) {
        return null
    }
    const pageObject = JSON.parse(linksBody) as Page
    if (!isPage(pageObject)) {
        throw new Error("List page links JSON from S3 is not a valid Page object.")
    }
    const itemLinks: readonly TitledLink[] = pageObject._links.items ?? []
    if (itemLinks.length === 0) {
        return null
    }
    const itemsJSON = await getEntitiesJSONFromLinks(client, itemLinks)
    return {
        body: getPageObjectJSONWithEmbedded(
            listPath,
            { ...listQuery, page },
            pageIndex,
            pageObject._links.next === null,
            itemLinks,
            itemsJSON,
        ),
    }
}

export default hydrateListPageFromS3
