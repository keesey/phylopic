import { Loader } from "@phylopic/ui"
import { getIdentifier, Identifier, Nomen } from "@phylopic/utils"
import { FC } from "react"
import { SearchEntry } from "~/search/SearchEntry"
import usePhyloPicSearch from "~/search/usePhyloPicSearch"
import { ICON_CHECK } from "~/ui/ICON_SYMBOLS"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import SearchOptions from "../../../SearchOptions"
import BroaderParentPrompt from "./BroaderParentPrompt"
import NewNodeCreator from "./NewNodeCreator"
export type Props = {
    childName: Nomen
    nameText: string
    onComplete: (identifier: Identifier, newTaxonName?: string) => void
    onSelect: (value: SearchEntry | null) => void
    selected: SearchEntry | null
}
export const ParentSearch: FC<Props> = ({ childName, nameText, selected, onComplete, onSelect }) => {
    const { data: entries, error, pending } = usePhyloPicSearch(nameText)
    if (pending) {
        return (
            <Speech mode="system">
                <p>Looking that up&hellip;</p>
                <Loader />
            </Speech>
        )
    }
    if (error) {
        return (
            <Speech mode="system">
                <p>Whoops! Had trouble finding that.</p>
                <p>&ldquo;{String(error)}&rdquo;</p>
            </Speech>
        )
    }
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
    if (!entries.length) {
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
                <p>{entries.length === 1 ? "This one?" : "Is that one of these?"}</p>
            </Speech>
            <SearchOptions entries={entries} onSelect={onSelect} />
        </>
    )
}
export default ParentSearch
