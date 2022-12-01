import { ImageWithEmbedded } from "@phylopic/api-models"
import { compareStrings, isDefined } from "@phylopic/utils"
import { useContext, useMemo } from "react"
import CollectionsContext from "../context/CollectionsContext"
import useCurrentCollection from "./useCurrentCollection"
const useCurrentCollectionImages = (): readonly ImageWithEmbedded[] => {
    const [{ entities }] = useContext(CollectionsContext)
    const collection = useCurrentCollection()
    return useMemo(() => {
        if (!collection) {
            return []
        }
        return Array.from(collection)
            .map(uuid => entities[uuid])
            .filter(record => record?.type === "image")
            .map(record => record.entity as ImageWithEmbedded)
            .filter(isDefined)
            .sort((a, b) => compareStrings(a.created, b.created) || compareStrings(a.uuid, b.uuid))
    }, [collection, entities])
}
export default useCurrentCollectionImages
