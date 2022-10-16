import { Entity, Node } from "@phylopic/source-models"
import { SearchContext } from "@phylopic/ui"
import { getIdentifier } from "@phylopic/utils"
import axios from "axios"
import { FC, useCallback, useContext } from "react"
import { SearchEntry } from "~/models/SearchEntry"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
import NameView from "~/views/NameView"
import useEntries from "./useEntries"
export interface Props {
    onSelect: (node: Entity<Node> | undefined) => void
}
export const NodeSearch: FC<Props> = ({ onSelect }) => {
    const handleEntryClick = useCallback(
        async (entry: SearchEntry) => {
            if (entry.authority === "phylopic.org" && entry.namespace === "nodes") {
                onSelect({
                    uuid: entry.objectID,
                    value: {
                        created: new Date().toISOString(),
                        modified: new Date().toISOString(),
                        names: [entry.name],
                        parent: null,
                    },
                })
            } else {
                try {
                    const response = await axios.post<Entity<Node>>(
                        `/api/nodes/import/${getIdentifier(entry.authority, entry.namespace, entry.objectID)}`,
                    )
                    onSelect(response.data)
                } catch (e) {
                    alert(e)
                }
            }
        },
        [onSelect],
    )
    const entries = useEntries()
    return (
        <BubbleList>
            {entries.map(entry => (
                <BubbleItem
                    key={getIdentifier(entry.authority, entry.namespace, entry.objectID)}
                    onClick={() => handleEntryClick(entry)}
                    style={{ cursor: "pointer" }}
                    role="button"
                >
                    <NameView name={entry.name} />
                </BubbleItem>
            ))}
        </BubbleList>
    )
}
export default NodeSearch
