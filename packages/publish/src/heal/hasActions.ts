import { HealData } from "./getHealData.js"
const hasActions = (data: Pick<HealData, "externalsToPut" | "imagesToPut" | "keysToDelete" | "nodesToPut">) => {
    return (
        data.imagesToPut.size > 0 ||
        data.keysToDelete.size > 0 ||
        data.nodesToPut.size > 0 ||
        data.externalsToPut.size > 0
    )
}
export default hasActions
