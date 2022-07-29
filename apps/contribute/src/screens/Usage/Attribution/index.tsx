import { isPublicDomainLicenseURL, normalizeText, UUID } from "@phylopic/utils"
import { ChangeEvent, FC, useCallback, useMemo, useState } from "react"
import useAttribution from "~/editing/useAttribution"
import useLicense from "~/editing/useLicense"
import useSubmissionPatcher from "~/s3/swr/useSubmissionPatcher"
export interface Props {
    uuid: UUID
}
const Attribution: FC<Props> = ({ uuid }) => {
    const { data: attribution } = useAttribution(uuid)
    const { data: license } = useLicense(uuid)
    const required = useMemo(() => !isPublicDomainLicenseURL(license), [license])
    const [value, setValue] = useState<string>(attribution ?? "")
    const normalized = useMemo(() => normalizeText(value), [value])
    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }, [])
    const patch = useSubmissionPatcher(uuid)
    const handleFormSubmit = useCallback(() => {
        if (normalized || !required) {
            patch({ attribution: normalized || null })
        }
    }, [patch, normalized, required])
    return (
        <form onSubmit={handleFormSubmit}>
            <input
                onChange={handleInputChange}
                placeholder={`Who gets the credit for this?${required ? "" : " (optional)"}`}
                required={required}
                type="text"
            />
        </form>
    )
}
export default Attribution
