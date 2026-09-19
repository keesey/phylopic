import { List, isList } from "@phylopic/api-models"
import { UUID, createSearch } from "@phylopic/utils"
import { fetchDataAndCheck } from "@phylopic/utils-api"
export async function getNodeLineageByUUID(uuid: UUID, build: number) {
    const { data: lineage } = await fetchDataAndCheck<List>(
        `${process.env.NEXT_PUBLIC_API_URL}/nodes/${encodeURIComponent(uuid)}/lineage${createSearch({ build })}`,
        {},
        isList,
    )
    return lineage
}
