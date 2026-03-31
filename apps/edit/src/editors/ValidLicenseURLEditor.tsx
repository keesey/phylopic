import { isValidLicenseURL, LICENSE_NAMES, ValidLicenseURL, VALID_LICENSE_URLS } from "@phylopic/utils"
import { ChangeEvent, FC, useCallback, useState } from "react"
import styles from "./LicenseURLEditor.module.scss"
export type Props = {
    onChange: (value: ValidLicenseURL | null) => void
    value: ValidLicenseURL | null
}
const ValidLicenseURLEditor: FC<Props> = ({ onChange, value }) => {
    const [editing, setEditing] = useState(false)
    const selectChangeHandler = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            event.preventDefault()
            const newValue = event.currentTarget.value
            if (isValidLicenseURL(newValue) && newValue !== value) {
                onChange(newValue)
            }
            setEditing(false)
        },
        [onChange, value],
    )
    return (
        <div className={styles.main}>
            <div className={editing ? styles.labelEditing : styles.label}>
                <button className="editable" onClick={() => setEditing(true)}>
                    {value ? LICENSE_NAMES[value] ?? `INVALID LICENSE! ${value}` : "[Unlicensed]"}
                </button>{" "}
                {value && (
                    <a href={value} role="button" target="_blank" rel="noreferrer">
                        View
                    </a>
                )}
            </div>
            <select
                className={editing ? styles.selectEditing : styles.select}
                onChange={selectChangeHandler}
                value={value ?? undefined}
            >
                {Array.from(VALID_LICENSE_URLS).map(url => (
                    <option key={url} value={url}>
                        {LICENSE_NAMES[url]}
                    </option>
                ))}
            </select>
        </div>
    )
}
export default ValidLicenseURLEditor
