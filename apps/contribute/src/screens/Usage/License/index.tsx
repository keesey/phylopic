import { LICENSE_NAMES, UUID, ValidLicenseURL } from "@phylopic/utils"
import { FC, useCallback } from "react"
import useLicense from "~/editing/useLicense"
import useSubmissionPatcher from "~/s3/swr/useSubmissionPatcher"
import styles from "./index.module.scss"
export interface Props {
    uuid: UUID
}
const License: FC<Props> = ({ uuid }) => {
    const { data: license } = useLicense(uuid)
    const patch = useSubmissionPatcher(uuid)
    const updateLicense = useCallback((value: ValidLicenseURL) => patch({ license: value }), [patch])
    return (
        <form>
            {!license && <p>Please select one:</p>}
            {license && (
                <p>
                    <strong>
                        <a href={license} target="_blank" rel="noopener noferrer">
                            {LICENSE_NAMES[license]}
                        </a>
                    </strong>
                </p>
            )}
            <div className={styles.radioOption}>
                <input
                    checked={license === "https://creativecommons.org/publicdomain/mark/1.0/"}
                    id="license-pdm"
                    onChange={() => updateLicense("https://creativecommons.org/publicdomain/mark/1.0/")}
                    radioGroup="license"
                    readOnly
                    required
                    type="radio"
                />
                <label htmlFor="license-pdm">This is a preexisting image in the public domain.</label>
            </div>
            <div className={styles.radioOption}>
                <input
                    checked={license === "https://creativecommons.org/publicdomain/zero/1.0/"}
                    id="license-cc0"
                    onChange={() => updateLicense("https://creativecommons.org/publicdomain/zero/1.0/")}
                    radioGroup="license"
                    readOnly
                    required
                    type="radio"
                />
                <label htmlFor="license-cc0">I am releasing my work into the public domain.</label>
            </div>
            <div className={styles.radioOption}>
                <input
                    checked={license === "https://creativecommons.org/licenses/by/4.0/"}
                    id="license-cc-by"
                    onChange={() => updateLicense("https://creativecommons.org/licenses/by/4.0/")}
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
