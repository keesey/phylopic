import { normalizeQuery } from "@phylopic/api-models"
import { Page } from "@phylopic/source-client"
import { Entity, Node } from "@phylopic/source-models"
import { Loader } from "@phylopic/ui"
import { Nomen, stringifyNomen, UUID } from "@phylopic/utils"
import { FC, useCallback, useState } from "react"
import useSWR from "swr"
import fetchJSON from "~/fetch/fetchJSON"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
import Modal from "~/ui/Modal"
import NameView from "~/views/NameView"
import NameSelector from "../NameSelector"
export interface Props {
    onSelect: (node: Entity<Node> | undefined) => void
    open?: boolean
}
const NodeSelector: FC<Props> = ({ open, onSelect }) => {
    const [searchText, setSearchText] = useState("")
    const handleNameSelect = useCallback((value: Nomen) => {
        setSearchText(normalizeQuery(stringifyNomen(value)))
    }, [])
    const { data: searchResults, isValidating: searchValidating } = useSWR<Page<Node & { uuid: UUID }, number>>(
        searchText ? `/api/nodes/search?page=0&text=${encodeURIComponent(searchText)}` : null,
        fetchJSON,
    )
    if (!open) {
        return null
    }
    return (
        <Modal onClose={() => onSelect(undefined)} title="Select Node">
            <p>Enter a name:</p>
            {/* eslint-disable jsx-a11y/no-autofocus */}
            <NameSelector autoFocus onSelect={handleNameSelect} />
            {/* eslint-enable jsx-a11y/no-autofocus */}
            {searchText && !searchResults?.items.length && searchValidating && <Loader />}
            {searchText && !searchResults?.items.length && !searchValidating && <p>No results found.</p>}
            {searchText && Boolean(searchResults?.items.length) && (
                <BubbleList>
                    {searchResults?.items.map(node => (
                        <BubbleItem key={node.uuid}>
                            <button onClick={() => onSelect({ value: node, uuid: node.uuid })}>
                                <NameView name={node.names[0]} />
                            </button>
                        </BubbleItem>
                    ))}
                </BubbleList>
            )}
        </Modal>
    )
}
export default NodeSelector
