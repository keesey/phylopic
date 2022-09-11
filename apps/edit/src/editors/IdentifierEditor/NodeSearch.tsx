import { Submission } from "@phylopic/source-models"
import { fetchJSON, SearchContext } from "@phylopic/ui"
import { getIdentifier, Hash } from "@phylopic/utils"
import { ChangeEvent, FC, useCallback, useContext, useState } from "react"
import useSWR from "swr"
import usePatcher from "~/swr/usePatcher"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
import NameView from "~/views/NameView"
import { SearchEntry } from "./SearchEntry"
import useEntries from "./useEntries"
export type Props = {
    hash: Hash
}
export const NodeSearch: FC<Props> = ({ hash }) => {
    const [{ text }, dispatch] = useContext(SearchContext) ?? [{}]
    const [editedText, setEditedText] = useState(text ?? "")
    const key = `/api/submissions/_/${encodeURIComponent(hash)}`
    const submisssionSWR = useSWR<Submission & { hash: Hash }>(key, fetchJSON)
    const patch = usePatcher(key, submisssionSWR)
    const handleInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.currentTarget.value ?? ""
            setEditedText(value)
            dispatch?.({ type: "SET_TEXT", payload: value })
        },
        [dispatch],
    )
    const handleEntryClick = useCallback(
        (entry: SearchEntry) => {
            patch({ newTaxonName: null, identifier: getIdentifier(entry.authority, entry.namespace, entry.objectID) })
        },
        [patch],
    )
    const entries = useEntries()
    return (
        <>
            <input value={editedText} onChange={handleInputChange} type="search" />
            {Boolean(text) && (
                <BubbleList>
                    {entries.map(entry => (
                        <BubbleItem
                            key={getIdentifier(entry.authority, entry.namespace, entry.objectID)}
                            onClick={() => handleEntryClick(entry)}
                            style={{ cursor: "pointer" }}
                        >
                            <NameView name={entry.name} />
                        </BubbleItem>
                    ))}
                </BubbleList>
            )}
        </>
    )
}
export default NodeSearch
