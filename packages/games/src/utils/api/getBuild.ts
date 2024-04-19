import { isAPI } from "@phylopic/api-models"
import { fetchDataAndCheck } from "@phylopic/utils-api"
export const getBuild = async () => {
    const { data: api } = await fetchDataAndCheck(`${process.env.NEXT_PUBLIC_API_URL}`, {}, isAPI)
    return api.build
}
