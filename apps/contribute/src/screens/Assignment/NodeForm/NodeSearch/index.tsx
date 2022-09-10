import { Loader, SearchContext } from "@phylopic/ui"
import { getIdentifier } from "@phylopic/utils"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { ICON_CHECK, ICON_X } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import useComplete from "../../AssignmentContainer/hooks/useComplete"
import useDispatch from "../../AssignmentContainer/hooks/useDispatch"
import useParentRequested from "../../AssignmentContainer/hooks/useParentRequested"
import useText from "../../AssignmentContainer/hooks/useText"
import NameForm from "../NameForm"
import ParentSelector from "./ParentSelector"
import { SearchEntry } from "./SearchEntry"
import EntryButton from "./SearchOptions/EntryButton"
import useEntries from "./useEntries"
export const NodeSearch: FC = () => {
    const text = useText()
    const [{ text: searchText }] = useContext(SearchContext) ?? [{}]
    const parentRequested = useParentRequested()
    const dispatch = useDispatch()
    const entries = useEntries()
    const complete = useComplete()
    const [searchTimedout, setSearchTimedOut] = useState(false)
    useEffect(() => {
        setSearchTimedOut(false)
        if (searchText && !entries.length) {
            const timeout = setTimeout(() => setSearchTimedOut(true), 2000)
            return () => clearTimeout(timeout)
        }
    }, [entries.length, searchText])
    const handleEntryClick = useCallback(
        async (entry: SearchEntry) => {
            await complete(getIdentifier(entry.authority, entry.namespace, entry.objectID), null)
        },
        [complete],
    )
    return (
        <>
            <NameForm
                editable={!parentRequested}
                onChange={payload => dispatch?.({ type: "SET_TEXT", payload })}
                placeholder="Species or other taxonomic group"
                value={text ?? ""}
            />
            {Boolean(text) && (
                <>
                    <Speech mode="system">
                        <small>
                            (Search partly powered by{" "}
                            <a
                                href="https://tree.opentreeoflife.org/about/open-tree-of-life"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Open Tree of Life
                            </a>
                            .)
                        </small>
                    </Speech>
                    <Speech mode="system">
                        {entries.length === 0 && !searchTimedout && (
                            <>
                                <p>Looking that up&hellip;</p>
                                <Loader />
                            </>
                        )}
                        {entries.length === 0 && searchTimedout && (
                            <p>I don&rsquo;t think I know that one. Are you sure you spelled it right?</p>
                        )}
                        {entries.length === 1 && <p>Is this it?</p>}
                        {entries.length > 1 && <p>Is it one of these?</p>}
                    </Speech>
                    {!parentRequested && (
                        <UserOptions>
                            <>
                                {entries.map(entry => (
                                    <EntryButton
                                        key={getIdentifier(entry.authority, entry.namespace, entry.objectID)}
                                        onClick={() => handleEntryClick(entry)}
                                        value={entry}
                                    />
                                ))}
                            </>
                            {entries.length === 0 && searchTimedout && (
                                <>
                                    <UserButton
                                        icon={ICON_CHECK}
                                        onClick={() => dispatch?.({ type: "REQUEST_PARENT" })}
                                    >
                                        Oh, I&rsquo;m sure.
                                    </UserButton>
                                    <UserButton danger icon={ICON_X} onClick={() => dispatch?.({ type: "RESET" })}>
                                        Um &hellip; maybe not.
                                    </UserButton>
                                </>
                            )}
                            {entries.length > 0 && (
                                <UserButton danger icon={ICON_X} onClick={() => dispatch?.({ type: "REQUEST_PARENT" })}>
                                    No, I don&rsquo;t see it.
                                </UserButton>
                            )}
                        </UserOptions>
                    )}
                    {parentRequested && (
                        <>
                            <Speech mode="user">
                                {entries.length === 0 && <p>Oh, I&rsquo;m sure.</p>}
                                {entries.length > 0 && <p>No, I don&rsquo;t see it.</p>}
                            </Speech>
                            <ParentSelector />
                        </>
                    )}
                </>
            )}
        </>
    )
}
export default NodeSearch
