import { LICENSE_NAMES, UUID, ValidLicenseURL } from "@phylopic/utils"
import { FC, useCallback } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageMutator from "~/editing/hooks/useImageMutator"
import styles from "./index.module.scss"
export interface Props {
    uuid: UUID
}
const License: FC<Props> = ({ uuid }) => {
    const image = useImage(uuid)
    const license = image?.license
    const mutate = useImageMutator(uuid)
    const updateLicense = useCallback((value: ValidLicenseURL) => mutate({ license: value }), [mutate])
    if (!image) {
        return null
    }
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
