import { normalizeText } from "@phylopic/utils"
import { KeyboardEvent, useCallback, useEffect, useState, FC } from "react"
import styles from "./TextEditor.module.scss"

export type Props =
    | {
          onChange: (value: string | undefined) => void
          modified: string | null
          optional: true
          original: string | null
          emptyLabel?: string
      }
    | {
          modified: string
          onChange: (value: string) => void
          optional: false
          original: string
      }
const TextEditor: FC<Props> = props => {
    const [editing, setEditing] = useState(false)
    const [newValue, setNewValue] = useState(props.modified ?? "")
    useEffect(() => setNewValue(props.modified ?? ""), [props.modified])
    const inputBlurCallback = useCallback(() => {
        setNewValue(props.modified ?? "")
        setEditing(false)
    }, [props.modified])
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
                        props.onChange(normalized || undefined)
                    } else {
                        props.onChange(normalized)
                    }
                    event.currentTarget.blur()
                    break
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [newValue, props.modified, props.onChange, props.optional],
    )
    const changed = props.modified !== props.original
    const className = ["editable", changed && "changed"].filter(Boolean).join(" ")
    if (!editing) {
        return (
            <div className={styles.label}>
                <button
                    className={className}
                    onClick={() => setEditing(true)}
                    title={changed ? props.original || (props.optional && props.emptyLabel) || undefined : undefined}
                >
                    {props.modified || (props.optional && props.emptyLabel)}
                </button>
            </div>
        )
    }
    return (
        <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            className={className}
            onKeyDownCapture={inputKeyDownCallback}
            onChange={event => setNewValue(event.currentTarget.value)}
            onBlur={inputBlurCallback}
            type="text"
            value={newValue}
        />
    )
}
export default TextEditor
