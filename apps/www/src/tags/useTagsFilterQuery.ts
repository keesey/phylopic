import { ImageListParameters } from "@phylopic/api-models"
import { useContext, useMemo } from "react"
import TagsFilterTypeContext from "./TagsFilterTypeContext"
const useTagsFilterQuery = () => {
    const [tags] = useContext(TagsFilterTypeContext) ?? []
    return useMemo<ImageListParameters>(() => (tags?.size ? { filter_tags: Array.from(tags).sort().join(",") } : {}), [tags])
}
export default useTagsFilterQuery
