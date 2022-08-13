import { Contributor } from "@phylopic/source-models"
import useContributorSWR from "./useContributorSWR"
const useContributor = (): Contributor | null => {
    const { data } = useContributorSWR()
    return data ?? null
}
export default useContributor
