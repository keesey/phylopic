import { Loader } from "@phylopic/ui"
import { Nomen, stringifyNomen, UUID } from "@phylopic/utils"
import { FC, useMemo, useState } from "react"
import { SearchEntry } from "~/search/SearchEntry"
import usePhyloPicSearch from "~/search/usePhyloPicSearch"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import SearchOptions from "../../../SearchOptions"
import BroaderParentPrompt from "./BroaderParentPrompt"
import NewNodeCreator from "./NewNodeCreator"
export type Props = {
    childName: Nomen
    name: Nomen
    onComplete: (uuid: UUID) => void
}
    export const ParentSearch: FC<Props> = ({ childName, name, onComplete }) => {
    const searchText = useMemo(() => stringifyNomen(name), [name])
    const { data: entries, error, pending } = usePhyloPicSearch(searchText)
    const [selected, setSelected] = useState<SearchEntry | null>(null)
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
                <NewNodeCreator name={childName} onComplete={onComplete} parentUUID={selected.objectID} />
            </>
        )
    }
    if (!entries.length) {
        return <BroaderParentPrompt />
    }
    return (
        <>
            <Speech mode="system">
                <p>{entries.length === 1 ? "This one?" : "Is that one of these?"}</p>
            </Speech>
            <SearchOptions entries={entries} includeNull={false} onSelect={setSelected} />
        </>
    )
}
export default ParentSearch
