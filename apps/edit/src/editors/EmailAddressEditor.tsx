import { EmailAddress, isEmailAddress } from "@phylopic/utils"
import { KeyboardEvent, useCallback, useEffect, useState, FC } from "react"
import styles from "./TextEditor.module.scss"

export type Props = {
    modified: EmailAddress
    onChange: (value: EmailAddress) => void
    original: EmailAddress
}
const EmailAddressEditor: FC<Props> = ({ modified, onChange, original }) => {
    const [editing, setEditing] = useState(false)
    const [newValue, setNewValue] = useState(modified)
    useEffect(() => setNewValue(modified), [modified])
    const inputBlurCallback = useCallback(() => {
        setNewValue(modified)
        setEditing(false)
    }, [modified])
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
                    const email = newValue.trim()
                    if (!isEmailAddress(email)) {
                        return alert("Not a valid email address.")
                    }
                    onChange(email)
                    event.currentTarget.blur()
                    break
                }
            }
        },
        [newValue, onChange],
    )
    const changed = modified !== original
    const className = ["editable", changed && "changed"].filter(Boolean).join(" ")
    if (!editing) {
        return (
            <div className={styles.label}>
                <button className={className} onClick={() => setEditing(true)} title={changed ? original : undefined}>
                    {modified}
                </button>{" "}
                <a href={`mailto:${modified}`} role="button">
                    Email
                </a>
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
            type="email"
            value={newValue}
        />
    )
}
export default EmailAddressEditor
