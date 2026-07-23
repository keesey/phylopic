import {
    isLegacyLicenseURL,
    isLicenseURL,
    LEGACY_LICENSE_URLS,
    LicenseURL,
    LICENSE_NAMES,
    VALID_LICENSE_URLS,
} from "@phylopic/utils"
import { ChangeEvent, FC, useCallback, useState } from "react"
import styles from "./LicenseURLEditor.module.scss"
export type Props = {
    onChange: (value: LicenseURL | null) => void
    value: LicenseURL | null
}
const LicenseURLEditor: FC<Props> = ({ onChange, value }) => {
    const [editing, setEditing] = useState(false)
    const selectChangeHandler = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            event.preventDefault()
            const newValue = event.currentTarget.value
            if (isLicenseURL(newValue) && newValue !== value) {
                if (!isLegacyLicenseURL(newValue) || confirm("Are you sure you want to use a legacy license?")) {
                    onChange(newValue)
                }
            }
            setEditing(false)
        },
        [onChange, value],
    )
    return (
        <div className={styles.main}>
            <div className={editing ? styles.labelEditing : styles.label}>
                <button className="editable" onClick={() => setEditing(true)}>
                    {value ? (LICENSE_NAMES[value] ?? `INVALID LICENSE! ${value}`) : "[Unlicensed]"}
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
                <optgroup label="Valid">
                    {Array.from(VALID_LICENSE_URLS).map(url => (
                        <option key={url} value={url}>
                            {LICENSE_NAMES[url]}
                        </option>
                    ))}
                </optgroup>
                <optgroup label="Legacy">
                    {Array.from(LEGACY_LICENSE_URLS).map(url => (
                        <option key={url} value={url}>
                            {LICENSE_NAMES[url]}
                        </option>
                    ))}
                </optgroup>
            </select>
        </div>
    )
}
export default LicenseURLEditor
