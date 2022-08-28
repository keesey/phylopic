import { normalizeText } from "@phylopic/utils"
import { FC, KeyboardEvent, useCallback, useEffect, useState } from "react"
import styles from "./TextEditor.module.scss"
export type Props =
    | {
          onChange: (value: string | null) => void
          optional: true
          value: string | null
          emptyLabel?: string
      }
    | {
          onChange: (value: string) => void
          optional: false
          value: string
      }
const TextEditor: FC<Props> = props => {
    const [editing, setEditing] = useState(false)
    const [newValue, setNewValue] = useState(props.value ?? "")
    useEffect(() => setNewValue(props.value ?? ""), [props.value])
    const inputBlurCallback = useCallback(() => {
        setNewValue(props.value ?? "")
        setEditing(false)
    }, [props.value])
    const inputKeyDownCallback = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            switch (event.key) {
                case "Escape": {
                    event.preventDefault()
                    event.currentTarget.blur()
                    break
                }
                case "Enter": {
                    event.preventDefault()
                    const normalized = normalizeText(newValue ?? "")
                    if (props.optional) {
                        props.onChange(normalized || null)
                    } else {
                        props.onChange(normalized)
                    }
                    event.currentTarget.blur()
                    break
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [newValue, props.onChange, props.optional, props.value],
    )
    if (!editing) {
        return (
            <div className={styles.label}>
                <button className="editable" onClick={() => setEditing(true)}>
                    {props.value || (props.optional && props.emptyLabel) || undefined}
                </button>
            </div>
        )
    }
    return (
        <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            className="editable"
            onBlur={inputBlurCallback}
            onChange={event => setNewValue(event.currentTarget.value)}
            onKeyDownCapture={inputKeyDownCallback}
            type="text"
            value={newValue}
        />
    )
}
export default TextEditor
