import { isValidLicenseURL, ValidLicenseURL } from "@phylopic/utils"
import { FC, useCallback, useMemo, useState } from "react"
import { WorkingSubmission } from "../WorkingSubmission"
import Attribution from "./Attribution"
import License from "./License"
import { UsageResult } from "./UsageResult"
interface Props {
    onComplete?: (result: UsageResult) => void
    suggestion?: WorkingSubmission
}
const Usage: FC<Props> = ({ onComplete, suggestion }) => {
    const [licenseURL, setLicenseURL] = useState<ValidLicenseURL | undefined>()
    const licenseSuggestion = useMemo(
        () => (isValidLicenseURL(suggestion?.license) ? suggestion?.license : undefined),
        [suggestion?.license],
    )
    const handleAttributionComplete = useCallback(
        (value: string | undefined) => {
            if (licenseURL) {
                onComplete?.({
                    attribution: value || null,
                    license: licenseURL,
                })
            }
        },
        [licenseURL, onComplete],
    )
    return (
        <section id="license">
            <p>Which license would you like to make it available under?</p>
            <License onComplete={setLicenseURL} suggestion={licenseSuggestion} />
            {licenseURL && (
                <Attribution
                    licenseURL={licenseURL}
                    onComplete={handleAttributionComplete}
                    suggestion={suggestion?.attribution}
                />
            )}
        </section>
    )
}
export default Usage
