import { Nomen, stringifyNormalized } from "@phylopic/utils"
import { NomenPartClass } from "parse-nomen"
import { FC, useEffect, useMemo, useState } from "react"
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
export type Props = {
    onChange: (value: Nomen) => void
    value: Nomen
}
const NameEditor: FC<Props> = ({ onChange, value }) => {
    const [editing, setEditing] = useState(false)
    const [modified, setModified] = useState(() => [...value])
    useEffect(() => setModified([...value]), [value])
    const changed = useMemo(() => stringifyNormalized(modified) !== stringifyNormalized(value), [modified, value])
    return (
        <section className={styles.main}>
            <header className={changed ? "changed" : undefined}>
                {!editing && (
                    <button key="view" onClick={() => setEditing(true)}>
                        <NameView name={modified} />
                    </button>
                )}
                {editing && <NameSelector autoFocus key="selector" value={modified} onSelect={onChange} />}
            </header>
            <ul className={styles.partList}>
                {modified.map((part, index) => (
                    <li key={`part:${index}`}>
                        <NomenPartEditor
                            isFirst={index === 0}
                            onChange={part =>
                                setModified([...modified.slice(0, index), ...(part ? [part] : []), ...modified.slice(index + 1)])
                            }
                            value={part}
                        />
                    </li>
                ))}
                <li key="new">
                    <TextEditor
                        onChange={text => {
                            if (text) {
                                setModified([...modified, { class: getNextClass(modified), text }])
                            }
                        }}
                        emptyLabel="[Append]"
                        optional
                        value=""
                    />
                </li>
            </ul>
            <button disabled={!changed} onClick={() => onChange(modified)}>Accept</button>
        </section>
    )
}
export default NameEditor
