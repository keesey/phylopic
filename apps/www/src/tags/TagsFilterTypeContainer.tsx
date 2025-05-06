import { FC, ReactNode, useState } from "react"
import { TagsFilterType } from "~/models/TagsFilterType"
import TagsFilterTypeContext from "./TagsFilterTypeContext"
export interface Props {
    children?: ReactNode
    initialValue?: TagsFilterType
}
const TagsTypeFilterContainer: FC<Props> = ({ children, initialValue }) => {
    const contextValue = useState(initialValue)
    return <TagsFilterTypeContext.Provider value={contextValue}>{children}</TagsFilterTypeContext.Provider>
}
export default TagsTypeFilterContainer
