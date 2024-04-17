import { List, Node, isList } from "@phylopic/api-models"
import { fetchDataAndCheck } from "@phylopic/utils-api"
export async function getNodeLineage(node: Pick<Node, "_links">) {
    const { data: lineage } = await fetchDataAndCheck<List>(
        `${process.env.NEXT_PUBLIC_API_URL}${node._links.lineage.href}`,
        {},
        isList,
    )
    return lineage
}
