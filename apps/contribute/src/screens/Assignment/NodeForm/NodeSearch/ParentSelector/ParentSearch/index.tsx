import { SearchContext } from "@phylopic/ui"
import { getIdentifier, Identifier, Nomen } from "@phylopic/utils"
import { FC, useContext } from "react"
import { ICON_CHECK } from "~/ui/ICON_SYMBOLS"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import SearchOptions from "../../../SearchOptions"
import { SearchEntry } from "../../SearchEntry"
import BroaderParentPrompt from "./BroaderParentPrompt"
import NewNodeCreator from "./NewNodeCreator"
export type Props = {
    childName: Nomen
    nameText: string
    onComplete: (identifier: Identifier, newTaxonName: string | null) => void
    onSelect: (value: SearchEntry | null) => void
    selected: SearchEntry | null
}
export const ParentSearch: FC<Props> = ({ childName, selected, onComplete, onSelect }) => {
    const [{ nodeResults }] = useContext(SearchContext) ?? [{}]
    if (selected) {
        return (
            <>
                <Speech mode="user">
                    <p>
                        <NameView value={selected.name} />.
                    </p>
                </Speech>
                <NewNodeCreator
                    name={childName}
                    onComplete={onComplete}
                    parentIdentifier={getIdentifier(selected.authority, selected.namespace, selected.objectID)}
                />
            </>
        )
    }
    if (!nodeResults?.length) {
        return (
            <>
                <BroaderParentPrompt />
                <UserOptions>
                    <UserButton icon={ICON_CHECK} onClick={() => onSelect(null)}>
                        Okay.
                    </UserButton>
                </UserOptions>
            </>
        )
    }
    return (
        <>
            <Speech mode="system">
                <p>{nodeResults.length === 1 ? "This one?" : "Is that one of these?"}</p>
            </Speech>
            <SearchOptions entries={nodeResults} onSelect={onSelect} />
        </>
    )
}
export default ParentSearch
