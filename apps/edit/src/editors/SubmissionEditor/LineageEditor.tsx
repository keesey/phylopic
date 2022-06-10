import { Entity, Node, NodeIdentifier } from "@phylopic/source-models"
import { Identifier, isUUID, stringifyNormalized, UUID } from "@phylopic/utils"
import { useCallback, useContext, useMemo, useState, FC } from "react"
import Context from "~/contexts/SubmissionEditorContainer/Context"
// import LineageSelector from "~/selectors/LineageSelector"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
import NameView from "~/views/NameView"

const getNodeUUID = (identifier: Identifier | null | undefined): UUID | undefined =>
    identifier?.startsWith("phylopic.org/nodes/") ? identifier.slice(identifier.lastIndexOf("/") + 1) : undefined
const LineageEditor: FC = () => {
    const [pending, setPending] = useState(false)
    const [state, dispatch] = useContext(Context) ?? []
    // const [lineageSelectorOpen, setLineageSelectorOpen] = useState(false)
    const lineage = state?.modified.lineage ?? []
    const changed = useMemo(
        () => stringifyNormalized(state?.modified.lineage) !== stringifyNormalized(state?.original.lineage),
        [state?.modified.lineage, state?.original.lineage],
    )
    const expandToRoot = useCallback(() => {
        // :TODO: Update this
        const specificUUID = getNodeUUID(state?.modified.contribution.specific.identifier)
        if (state?.modified.contribution.specific.identifier && dispatch && specificUUID) {
            ;(async () => {
                setPending(true)
                try {
                    const uuid = getNodeUUID(state.modified.contribution.general?.identifier) ?? specificUUID
                    if (!isUUID(uuid)) {
                        throw new Error("Cannot expand if the specific node is not migrated.")
                    }
                    const result = await fetch(`/api/lineage/${encodeURIComponent(uuid)}`)
                    if (!result.ok) {
                        return alert(result.statusText)
                    }
                    const resultLineage: readonly Entity<Node>[] = await result.json()
                    const newIdentifiers = resultLineage.map(
                        entity =>
                            ({
                                identifier: "phylopic.org/nodes/" + entity.uuid,
                                name: entity.value.names[0],
                            } as NodeIdentifier),
                    )
                    const newLineage = [...newIdentifiers, ...state.modified.lineage.slice(1)]
                    dispatch({ payload: newLineage, type: "SET_LINEAGE" })
                } finally {
                    setPending(false)
                }
            })()
        }
    }, [
        dispatch,
        state?.modified.contribution.general?.identifier,
        state?.modified.contribution.specific.identifier,
        state?.modified.lineage,
    ])
    const removeGeneral = useCallback(() => {
        if (dispatch && state?.modified.lineage.length) {
            dispatch({
                payload: state.modified.lineage.slice(-1),
                type: "SET_LINEAGE",
            })
        }
    }, [dispatch, state?.modified.lineage])
    const selectGeneral = useCallback(
        (identifier: NodeIdentifier) => {
            if (dispatch && state?.modified.lineage.length) {
                const index = state.modified.lineage.indexOf(identifier)
                if (index >= 0 && index < state.modified.lineage.length - 1) {
                    dispatch({
                        payload: state.modified.lineage.slice(index),
                        type: "SET_LINEAGE",
                    })
                }
            }
        },
        [dispatch, state?.modified.lineage],
    )
    /*
    const handleLineageSelect = useCallback(
        (identifiers: readonly NodeIdentifier[]) => {
            setLineageSelectorOpen(false)
            if (dispatch && identifiers.length) {
                dispatch({ payload: identifiers, type: "SET_LINEAGE" })
            }
        },
        [dispatch],
    )
    */
    const className = [changed && "changed", pending && "pending"].filter(Boolean).join(" ")
    return (
        <section className={className}>
            <BubbleList>
                {getNodeUUID(lineage[0]?.identifier) !== state?.source.root && (
                    <BubbleItem key="expand" light>
                        <button className="link" onClick={pending ? undefined : expandToRoot}>
                            Expand
                        </button>
                    </BubbleItem>
                )}
                {lineage.map((lineageItem, index) => {
                    const uuid = getNodeUUID(lineageItem.identifier)
                    if (!uuid) {
                        return null
                    }
                    return (
                        <BubbleItem key={`node:${uuid}`}>
                            <a href={`/nodes/${uuid}`}>
                                <NameView short name={lineageItem.name} />
                            </a>
                            {index === 0 &&
                                stringifyNormalized(lineageItem) !==
                                    stringifyNormalized(state?.modified.contribution.specific) && (
                                    <button onClick={pending ? undefined : removeGeneral} title="Remove General Node">
                                        ☑
                                    </button>
                                )}
                            {index !== 0 &&
                                stringifyNormalized(lineageItem) !==
                                    stringifyNormalized(state?.modified.contribution.specific) && (
                                    <button
                                        onClick={pending ? undefined : () => selectGeneral(lineageItem)}
                                        title="Select as General Node"
                                    >
                                        ☐
                                    </button>
                                )}
                            {uuid === getNodeUUID(state?.modified.contribution.specific.identifier) && (
                                <button
                                    // onClick={pending ? undefined : () => setLineageSelectorOpen(true)}
                                    title="Replace Specific Node"
                                >
                                    ✎
                                </button>
                            )}
                        </BubbleItem>
                    )
                })}
            </BubbleList>
            {/* :TODO convert to identifiers 
            {lineageSelectorOpen && (
                <LineageSelector key="lineageSelector" open={lineageSelectorOpen} onSelect={handleLineageSelect} />
            )}
            */}
        </section>
    )
}
export default LineageEditor
