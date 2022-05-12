import { NomenPartClass } from "parse-nomen"
import { Nomen, stringifyNormalized } from "@phylopic/utils"
import React, { useContext, useState, FC } from "react"
import Context from "~/contexts/NameEditorContainer/Context"
import NameSelector from "~/selectors/NameSelector"
import NameView from "~/views/NameView"
import TextEditor from "../TextEditor"
import styles from "./index.module.scss"
import NomenPartEditor from "./NomenPartEditor"

const getNextClass = (name: Nomen): NomenPartClass => {
    if (!name.length) {
        return "vernacular"
    }
    switch (name[name.length - 1].class) {
        case "vernacular":
        case "citation": {
            return "comment"
        }
        case "comment":
        case "operator": {
            return "scientific"
        }
        default: {
            return "citation"
        }
    }
}
const NameEditor: FC = () => {
    const [editing, setEditing] = useState(false)
    const [state, dispatch] = useContext(Context) ?? []
    if (!state?.modified || !dispatch) {
        return null
    }
    const changed = stringifyNormalized(state.modified) !== stringifyNormalized(state.original)
    return (
        <section className={styles.main}>
            <header className={changed ? "changed" : undefined}>
                {!editing && (
                    <button key="view" onClick={() => setEditing(true)}>
                        <NameView name={state.modified} />
                    </button>
                )}
                {editing && (
                    <NameSelector
                        key="selector"
                        value={state.modified}
                        onSelect={payload => dispatch({ type: "UPDATE_NAME", payload })}
                    />
                )}
            </header>
            <ul className={styles.partList}>
                {state.modified.map((_part, index) => (
                    <li key={`part:${index}`}>
                        <NomenPartEditor index={index} />
                    </li>
                ))}
                <li key="new">
                    <TextEditor
                        modified=""
                        onChange={payload =>
                            payload &&
                            dispatch({
                                type: "APPEND_PART",
                                payload: { class: getNextClass(state.modified), text: payload },
                            })
                        }
                        emptyLabel="[Append]"
                        optional
                        original=""
                    />
                </li>
            </ul>
        </section>
    )
}
export default NameEditor
