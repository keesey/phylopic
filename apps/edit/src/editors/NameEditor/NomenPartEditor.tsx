import { NomenPartClass } from "parse-nomen"
import { useContext, FC } from "react"
import Context from "~/contexts/NameEditorContainer/Context"
import TextEditor from "../TextEditor"
import styles from "./NomenPartEditor.module.scss"

export interface Props {
    index: number
}
const NomenPartEditor: FC<Props> = meta => {
    const [state, dispatch] = useContext(Context) ?? []
    const part = state?.modified?.[meta.index]
    if (!part || !dispatch) {
        return null
    }
    return (
        <section className={styles.main}>
            <div className={`nomen ${part.class} ${styles.textEditor}`}>
                <TextEditor
                    modified={part.text}
                    onChange={payload => dispatch({ type: "SET_TEXT", payload, meta })}
                    optional={false}
                    original={part.text}
                />
            </div>
            <select
                className={styles.classSelector}
                onChange={event =>
                    dispatch({
                        type: "SET_CLASS",
                        payload: event.currentTarget.value as NomenPartClass,
                        meta,
                    })
                }
                value={part.class}
            >
                <option value={"scientific" as NomenPartClass} label="scientific" />
                <option value={"vernacular" as NomenPartClass} label="vernacular" />
                <option value={"citation" as NomenPartClass} label="citation" />
                <option value={"comment" as NomenPartClass} label="comment" />
                <option value={"operator" as NomenPartClass} label="operator" />
                <option value={"rank" as NomenPartClass} label="rank" />
            </select>
            <button
                onClick={() => dispatch({ type: "REMOVE_PART", meta })}
                style={{ visibility: meta.index > 0 ? "visible" : "hidden" }}
            >
                ✕
            </button>
        </section>
    )
}
export default NomenPartEditor
