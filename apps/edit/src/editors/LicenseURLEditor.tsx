import {
    isLegacyLicenseURL,
    isLicenseURL,
    LEGACY_LICENSE_URLS,
    LicenseURL,
    LICENSE_NAMES,
    VALID_LICENSE_URLS,
} from "@phylopic/utils"
import { ChangeEvent, useCallback, useState, FC } from "react"
import styles from "./LicenseURLEditor.module.scss"

export type Props = {
    modified: LicenseURL
    onChange: (value: LicenseURL) => void
    original: LicenseURL
}
const LicenseURLEditor: FC<Props> = ({ modified, onChange, original }) => {
    const [editing, setEditing] = useState(false)
    const selectChangeHandler = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            event.preventDefault()
            const newValue = event.currentTarget.value
            if (isLicenseURL(newValue) && newValue !== original) {
                if (!isLegacyLicenseURL(newValue) || confirm("Are you sure you want to use a legacy license?")) {
                    onChange(newValue)
                }
            }
            setEditing(false)
        },
        [onChange, original],
    )
    const changed = modified !== original
    return (
        <div className={styles.main}>
            <div className={editing ? styles.labelEditing : styles.label}>
                <button
                    className={["editable", changed && "changed"].filter(Boolean).join(" ")}
                    onClick={() => setEditing(true)}
                    title={changed ? original : undefined}
                >
                    {LICENSE_NAMES[modified] ?? `INVALID LICENSE! ${modified}`}
                </button>{" "}
                <a href={modified} role="button">
                    View
                </a>
            </div>
            <select
                className={editing ? styles.selectEditing : styles.select}
                onChange={selectChangeHandler}
                value={modified}
            >
                <optgroup label="Valid">
                    {[...VALID_LICENSE_URLS].map(url => (
                        <option key={url} value={url}>
                            {LICENSE_NAMES[url]}
                        </option>
                    ))}
                </optgroup>
                <optgroup label="Legacy">
                    {[...LEGACY_LICENSE_URLS].map(url => (
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
