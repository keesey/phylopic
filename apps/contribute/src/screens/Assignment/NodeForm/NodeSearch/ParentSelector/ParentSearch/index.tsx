import { SearchContext } from "@phylopic/ui"
import { getIdentifier, Identifier, Nomen } from "@phylopic/utils"
import { FC, useCallback, useContext, useMemo, useState } from "react"
import { ICON_CHECK } from "~/ui/ICON_SYMBOLS"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import SearchOptions from "../../../SearchOptions"
import { SearchEntry } from "../../SearchEntry"
import NewNodeCreator from "./NewNodeCreator"
export type Props = {
    childName: Nomen
    onComplete: (identifier: Identifier, newTaxonName: string | null) => void
}
export const ParentSearch: FC<Props> = ({ childName, onComplete }) => {
    const [selected, setSelected] = useState<SearchEntry | null | undefined>()
    const [{ nodeResults, text }, dispatch] = useContext(SearchContext) ?? [{}]
    const entries = useMemo(
        () =>
            (nodeResults ?? []).map(
                result =>
                    ({
                        authority: "phylopic.org",
                        name: result.names[0],
                        namespace: "nodes",
                        objectID: result.uuid,
                        image: result._embedded.primaryImage,
                    } as SearchEntry),
            ),
        [nodeResults],
    )
    const reset = useCallback(() => {
        dispatch?.({ type: "SET_TEXT", payload: "" })
        setSelected(undefined)
    }, [dispatch])
    if (selected) {
        return (
            <>
                <Speech mode="system">
                    <p>{entries.length === 1 ? "This one?" : "Is that one of these?"}</p>
                </Speech>
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
    if (!text) {
        return null
    }
    if (!entries.length) {
        return (
            <>
                <Speech mode="system">
                    <p>Sorry, I don&rsquo;t know that one. Maybe try a larger, more general group?</p>
                </Speech>
                <UserOptions>
                    <UserButton icon={ICON_CHECK} onClick={reset}>
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
            {selected !== null && <SearchOptions entries={entries} onSelect={setSelected} />}
            {selected === null && (
                <>
                    <Speech mode="user">
                        <p>No.</p>
                    </Speech>
                    <Speech mode="system">
                        <p>Maybe try a larger, more general group?</p>
                    </Speech>
                    <UserOptions>
                        <UserButton icon={ICON_CHECK} onClick={reset}>
                            Okay.
                        </UserButton>
                    </UserOptions>
                </>
            )}
        </>
    )
}
export default ParentSearch
