import { Entity, Node } from "@phylopic/source-models"
import { stringifyNormalized } from "@phylopic/utils"
import { useCallback, useContext, useMemo, useState, FC } from "react"
import Context from "~/contexts/ImageEditorContainer/Context"
import LineageSelector from "~/selectors/LineageSelector"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
import NameView from "~/views/NameView"

const LineageEditor: FC = () => {
    const [pending, setPending] = useState(false)
    const [state, dispatch] = useContext(Context) ?? []
    const [lineageSelectorOpen, setLineageSelectorOpen] = useState(false)
    const lineage = state?.modified.lineage ?? []
    const changed = useMemo(
        () => stringifyNormalized(state?.modified.lineage) !== stringifyNormalized(state?.original.lineage),
        [state?.modified.lineage, state?.original.lineage],
    )
    const expandToRoot = useCallback(() => {
        if (dispatch && state?.modified.image.specific) {
            ;(async () => {
                setPending(true)
                try {
                    const result = await fetch(
                        `/api/lineage/${encodeURIComponent(
                            state.modified.image.general ?? state.modified.image.specific,
                        )}`,
                    )
                    if (!result.ok) {
                        return alert(result.statusText)
                    }
                    const newLineage: Entity<Node>[] = [...(await result.json()), ...state.modified.lineage.slice(1)]
                    dispatch({ payload: newLineage, type: "SET_LINEAGE" })
                } finally {
                    setPending(false)
                }
            })()
        }
    }, [dispatch, state?.modified.image.general, state?.modified.image.specific, state?.modified.lineage])
    const removeGeneral = useCallback(() => {
        if (dispatch && state?.modified.lineage.length) {
            dispatch({
                payload: state.modified.lineage.slice(-1),
                type: "SET_LINEAGE",
            })
        }
    }, [dispatch, state?.modified.lineage])
    const selectGeneral = useCallback(
        (entity: Entity<Node>) => {
            if (dispatch && state?.modified.lineage.length) {
                const index = state.modified.lineage.indexOf(entity)
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
    const handleLineageSelect = useCallback(
        (entities: readonly Entity<Node>[]) => {
            setLineageSelectorOpen(false)
            if (dispatch && entities.length) {
                dispatch({ payload: entities, type: "SET_LINEAGE" })
            }
        },
        [dispatch],
    )
    const className = [changed && "changed", pending && "pending"].filter(Boolean).join(" ")
    return (
        <section className={className}>
            <BubbleList>
                {lineage[0]?.uuid !== state?.source.root && (
                    <BubbleItem key="expand" light>
                        <button onClick={pending ? undefined : expandToRoot}>Expand</button>
                    </BubbleItem>
                )}
                {lineage.map((entity, index) => (
                    <BubbleItem key={`node:${entity.uuid}`}>
                        <a href={`/nodes/${entity.uuid}`}>
                            <NameView short name={entity.value.names[0]} />
                        </a>
                        {index === 0 && entity.uuid !== state?.modified.image.specific && (
                            <button onClick={pending ? undefined : removeGeneral} title="Remove General Node">
                                ☑
                            </button>
                        )}
                        {index !== 0 && entity.uuid !== state?.modified.image.specific && (
                            <button
                                onClick={pending ? undefined : () => selectGeneral(entity)}
                                title="Select as General Node"
                            >
                                ☐
                            </button>
                        )}
                        {entity.uuid === state?.modified.image.specific && (
                            <button
                                onClick={pending ? undefined : () => setLineageSelectorOpen(true)}
                                title="Replace Specific Node"
                            >
                                ✎
                            </button>
                        )}
                    </BubbleItem>
                ))}
            </BubbleList>
            {lineageSelectorOpen && (
                <LineageSelector key="lineageSelector" open={lineageSelectorOpen} onSelect={handleLineageSelect} />
            )}
        </section>
    )
}
export default LineageEditor
