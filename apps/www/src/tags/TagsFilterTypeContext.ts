import { createContext, Dispatch, SetStateAction } from "react"
import { TagsFilterType } from "~/models/TagsFilterType"
const TagsFilterTypeContext = createContext<
    Readonly<[TagsFilterType, Dispatch<SetStateAction<TagsFilterType>>]> | undefined
>(undefined)
export default TagsFilterTypeContext
