import { Node } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { Nomen, normalizeNomina, stringifyNormalized, UUID } from "@phylopic/utils"
import { parseNomen } from "parse-nomen"
import { FC, FormEvent, useCallback, useState } from "react"
import useSWR from "swr"
import NameSelector from "~/selectors/NameSelector"
import useModifiedPatcher from "~/swr/useModifiedPatcher"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
import NameView from "~/views/NameView"
import NameModal from "./NameModal"
export interface Props {
    onSplit?: (name: Nomen) => void
    uuid: UUID
}
const NamesEditor: FC<Props> = ({ onSplit, uuid }) => {
    const key = `/api/nodes/_/${uuid}`
    const response = useSWR<Node & { uuid: UUID }>(key, fetchJSON)
    const { data: node } = response
    const patcher = useModifiedPatcher(key, response)
    const [editedNameIndex, setEditedNameIndex] = useState(-1)
    const [namesText, setNamesText] = useState("")
    const handleNamesFormSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            if (node?.names) {
                const newNames = namesText
                    .trim()
                    .split("\n")
                    .map(line => line.trim())
                    .filter(Boolean)
                    .map(line => parseNomen(line))
                    .filter(n => n?.length > 0)
                if (newNames.length) {
                    patcher({ names: normalizeNomina([...node.names, ...newNames]) })
                }
            }
            setNamesText("")
        },
        [namesText, node?.names, patcher],
    )
    if (!node) {
        return null
    }
    return (
        <>
            <BubbleList>
                {node.names.map((name, index) => {
                    const json = stringifyNormalized(name)
                    const canLower =
                        name.length === 1 &&
                        name[0].class === "vernacular" &&
                        name[0].text.toLocaleLowerCase() !== name[0].text
                    return (
                        <BubbleItem key={`name:${json}`}>
                            <NameView name={name} />
                            <button onClick={() => setEditedNameIndex(index)} title="Edit Name">
                                ✎
                            </button>
                            {index > 0 && (
                                <>
                                    <button
                                        title="Make Canonical"
                                        onClick={() => patcher({ names: normalizeNomina([name, ...node.names]) })}
                                    >
                                        ♛
                                    </button>
                                    <button title="Split" onClick={() => onSplit?.(name)}>
                                        ⑂
                                    </button>
                                </>
                            )}
                            {canLower && (
                                <button
                                    title="Lower Case"
                                    onClick={() =>
                                        patcher({
                                            names: normalizeNomina([
                                                node.names[0],
                                                ...node.names
                                                    .slice(1)
                                                    .filter(n => stringifyNormalized(n) !== stringifyNormalized(name)),
                                                name.map(part => ({ ...part, text: part.text.toLocaleLowerCase() })),
                                            ]),
                                        })
                                    }
                                >
                                    a
                                </button>
                            )}
                            {index > 0 && (
                                <button
                                    title="Remove"
                                    onClick={() =>
                                        patcher({
                                            names: [
                                                node.names[0],
                                                ...node.names
                                                    .slice(1)
                                                    .filter(n => stringifyNormalized(n) !== stringifyNormalized(name)),
                                            ],
                                        })
                                    }
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
                        onSelect={name => patcher({ names: normalizeNomina([...node.names, name]) })}
                    />
                </BubbleItem>
            </BubbleList>
            <form onSubmit={handleNamesFormSubmit}>
                <textarea
                    name="names"
                    placeholder="Enter multiple new names here, one per line."
                    value={namesText}
                    onChange={event => setNamesText(event.currentTarget.value)}
                />
                <input type="submit" value="Add Multiple Names" />
            </form>
            <NameModal
                name={editedNameIndex >= 0 ? node.names[editedNameIndex] : null}
                onComplete={value => {
                    if (value)
                        patcher({
                            names: normalizeNomina([
                                ...node.names.slice(0, editedNameIndex),
                                value,
                                ...node.names.slice(editedNameIndex + 1),
                            ]),
                        })
                    setEditedNameIndex(-1)
                }}
            />
        </>
    )
}
export default NamesEditor
