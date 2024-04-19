import { Node, Page, TitledLink, isPage } from "@phylopic/api-models"
import { fetchDataAndCheck } from "@phylopic/utils-api"
import { getNodeLineage } from "./getNodeLineage"
export async function getNodeLineageLinks(node: Pick<Node, "_links">) {
    const lineage = await getNodeLineage(node)
    const links: TitledLink[] = []
    let pageLink = lineage._links.firstPage
    while (pageLink) {
        const { data: page } = await fetchDataAndCheck<Page>(
            `${process.env.NEXT_PUBLIC_API_URL}${pageLink.href}`,
            {},
            isPage,
        )
        links.push(...page._links.items)
        pageLink = page._links.next
    }
    return links
}
