import { LICENSE_NAMES, ValidLicenseURL } from "@phylopic/utils"
import { FC, FormEvent, useCallback, useState } from "react"
import styles from "./index.module.scss"
export interface Props {
    onComplete?: (value: ValidLicenseURL) => void
    suggestion?: ValidLicenseURL
}
const License: FC<Props> = ({ onComplete, suggestion }) => {
    const [value, setValue] = useState<ValidLicenseURL | undefined>(suggestion)
    const handleFormSubmit = useCallback(
        (event: FormEvent) => {
            event.preventDefault()
            if (value) {
                onComplete?.(value)
            }
        },
        [onComplete, value],
    )
    return (
        <form onSubmit={handleFormSubmit}>
            {!value && <p>Please select one:</p>}
            {value && (
                <p>
                    <strong>
                        <a href={value} target="_blank" rel="noopener noferrer">
                            {LICENSE_NAMES[value]}
                        </a>
                    </strong>
                </p>
            )}
            <div className={styles.radioOption}>
                <input
                    checked={value === "https://creativecommons.org/publicdomain/mark/1.0/"}
                    id="license-pdm"
                    onChange={() => setValue("https://creativecommons.org/publicdomain/mark/1.0/")}
                    radioGroup="license"
                    readOnly
                    required
                    type="radio"
                />
                <label htmlFor="license-pdm">This is a preexisting image in the public domain.</label>
            </div>
            <div className={styles.radioOption}>
                <input
                    checked={value === "https://creativecommons.org/publicdomain/zero/1.0/"}
                    id="license-cc0"
                    onChange={() => setValue("https://creativecommons.org/publicdomain/zero/1.0/")}
                    radioGroup="license"
                    readOnly
                    required
                    type="radio"
                />
                <label htmlFor="license-cc0">I am releasing my work into the public domain.</label>
            </div>
            <div className={styles.radioOption}>
                <input
                    checked={value === "https://creativecommons.org/licenses/by/4.0/"}
                    id="license-cc-by"
                    onChange={() => setValue("https://creativecommons.org/licenses/by/4.0/")}
                    radioGroup="license"
                    readOnly
                    required
                    type="radio"
                />
                <label htmlFor="license-cc-by">Attribution should always be given for this image.</label>
            </div>
        </form>
    )
}
export default License
