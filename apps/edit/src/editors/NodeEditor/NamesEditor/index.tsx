import { parseNomen } from "parse-nomen"
import { Nomen, normalizeNomina, stringifyNormalized } from "@phylopic/utils"
import { ChangeEvent, FormEvent, Fragment, useCallback, useContext, useMemo, useState, FC } from "react"
import Context from "~/contexts/NodeEditorContainer/Context"
import NameSelector from "~/selectors/NameSelector"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
import NameView from "~/views/NameView"
import NameModal from "./NameModal"

export interface Props {
    onSplit: (name: Nomen) => void
}
const NamesEditor: FC<Props> = ({ onSplit }) => {
    const [state, dispatch] = useContext(Context) ?? []
    const [editedNameIndex, setEditedNameIndex] = useState(-1)
    const modifiedNamesJSONList = useMemo(
        () => state?.modified.node.names.map(stringifyNormalized) ?? [],
        [state?.modified.node.names],
    )
    const modifiedNamesJSON = useMemo(() => new Set<string>(modifiedNamesJSONList), [modifiedNamesJSONList])
    const originalNamesJSON = useMemo(
        () => new Set<string>(state?.original.node.names.map(stringifyNormalized) ?? []),
        [state?.original.node.names],
    )
    const allNames = useMemo(
        () => normalizeNomina([...(state?.modified.node.names ?? []), ...(state?.original.node.names ?? [])]),
        [state?.modified.node.names, state?.original.node.names],
    )
    const [namesText, setNamesText] = useState("")
    const handleNamesChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
        setNamesText(event.currentTarget.value)
    }, [])
    const handleNamesFormSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            namesText
                .trim()
                .split("\n")
                .map(line => line.trim())
                .filter(Boolean)
                .map(line => parseNomen(line))
                .filter(n => n?.length > 0)
                .forEach(payload => dispatch?.({ type: "ADD_NAME", payload }))
            setNamesText("")
        },
        [dispatch, namesText],
    )
    if (!state) {
        return null
    }
    return (
        <>
            <BubbleList>
                {allNames.map((name, index) => {
                    const json = stringifyNormalized(name)
                    const deleted = !modifiedNamesJSON.has(json)
                    const created = !originalNamesJSON.has(json)
                    const newCanonical = index === 0 && json !== stringifyNormalized(state.original.node.names[0])
                    const canLower =
                        name.length === 1 &&
                        name[0].class === "vernacular" &&
                        name[0].text.toLocaleLowerCase() !== name[0].text
                    return (
                        <BubbleItem key={`name:${json}`} changed={deleted || created || newCanonical} deleted={deleted}>
                            <NameView key="name" name={name} />
                            <button
                                key="edit"
                                onClick={() => setEditedNameIndex(modifiedNamesJSONList.indexOf(json))}
                                title="Edit Name"
                            >
                                ✎
                            </button>
                            {index > 0 && (
                                <Fragment key="noncanonical">
                                    <button
                                        title="Make Canonical"
                                        onClick={() => dispatch?.({ type: "SET_CANONICAL_NAME", payload: name })}
                                    >
                                        ♛
                                    </button>
                                    <button title="Split" onClick={() => onSplit(name)}>
                                        ⑂
                                    </button>
                                </Fragment>
                            )}
                            {canLower && (
                                <button
                                    key="lower"
                                    title="Lower Case"
                                    onClick={() => {
                                        dispatch?.({ type: "REMOVE_NAME", payload: name })
                                        const payload = name.map(part => ({
                                            ...part,
                                            text: part.text.toLocaleLowerCase(),
                                        }))
                                        dispatch?.({ type: "ADD_NAME", payload })
                                    }}
                                >
                                    a
                                </button>
                            )}
                            {deleted && (
                                <button
                                    key="restore-remove"
                                    title="Restore"
                                    onClick={() => dispatch?.({ type: "ADD_NAME", payload: name })}
                                >
                                    ⎌
                                </button>
                            )}
                            {!deleted && index > 0 && (
                                <button
                                    key="restore-remove"
                                    title="Remove"
                                    onClick={() => dispatch?.({ type: "REMOVE_NAME", payload: name })}
                                >
                                    ✕
                                </button>
                            )}
                        </BubbleItem>
                    )
                })}
                <BubbleItem key="add" light>
                    <NameSelector
                        placeholder="Add Name"
                        onSelect={payload => dispatch?.({ type: "ADD_NAME", payload })}
                    />
                </BubbleItem>
            </BubbleList>
            <form onSubmit={handleNamesFormSubmit}>
                <textarea
                    name="names"
                    placeholder="Enter multiple new names here, one per line."
                    value={namesText}
                    onChange={handleNamesChange}
                />
                <input type="submit" value="Add Multiple Names" />
            </form>
            <NameModal nameIndex={editedNameIndex} onComplete={() => setEditedNameIndex(-1)} />
        </>
    )
}
export default NamesEditor
