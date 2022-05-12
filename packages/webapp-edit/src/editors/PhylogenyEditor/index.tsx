import React, { FC } from "react"
import UUIDSelector from "~/selectors/UUIDSelector"
import NodesEditor from "./NodesEditor"
import useAddLineage from "./useAddLineage"

const PhylogenyEditor: FC = () => {
    const addLineage = useAddLineage()
    return (
        <>
            <UUIDSelector placeholder="Add Node UUID" onSelect={addLineage} />
            <hr />
            <NodesEditor />
        </>
    )
}
export default PhylogenyEditor
