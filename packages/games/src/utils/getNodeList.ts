import { isList } from "@phylopic/api-models"
import { createSearch } from "@phylopic/utils"
import { fetchDataAndCheck } from "@phylopic/utils-api"
export const getNodeList = async (build?: number) => {
    const { data: list } = await fetchDataAndCheck(
        `${process.env.NEXT_PUBLIC_API_URL}/nodes${createSearch({ build })}`,
        {},
        isList,
    )
    return list
}
