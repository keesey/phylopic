import { NomenPart, NomenPartClass } from "parse-nomen"
import { FC } from "react"
import TextEditor from "../TextEditor"
import styles from "./NomenPartEditor.module.scss"

export interface Props {
    onChange: (value: NomenPart | null) => void
    value: NomenPart | null
    isFirst: boolean
}
const NomenPartEditor: FC<Props> = ({ isFirst, onChange, value }) => {
    if (!value) {
        return null
    }
    return (
        <section className={styles.main}>
            <div className={`nomen ${value.class} ${styles.textEditor}`}>
                <TextEditor onChange={text => onChange({ ...value, text })} optional={false} value={value.text} />
            </div>
            <select
                className={styles.classSelector}
                onChange={event => onChange({ ...value, class: event.currentTarget.value as NomenPartClass })}
                value={value.class}
            >
                <option value={"scientific" as NomenPartClass} label="scientific" />
                <option value={"vernacular" as NomenPartClass} label="vernacular" />
                <option value={"citation" as NomenPartClass} label="citation" />
                <option value={"comment" as NomenPartClass} label="comment" />
                <option value={"operator" as NomenPartClass} label="operator" />
                <option value={"rank" as NomenPartClass} label="rank" />
            </select>
            <button onClick={() => onChange(null)} style={{ visibility: isFirst ? "hidden" : "visible" }}>
                ✕
            </button>
        </section>
    )
}
export default NomenPartEditor
