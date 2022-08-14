import { isPublicDomainLicenseURL, normalizeText, UUID } from "@phylopic/utils"
import { ChangeEvent, FC, useCallback, useMemo, useState } from "react"
import useImage from "~/editing/hooks/useImage"
import useImageMutator from "~/editing/hooks/useImageMutator"
export interface Props {
    uuid: UUID
}
const Attribution: FC<Props> = ({ uuid }) => {
    const image = useImage(uuid)
    const mutate = useImageMutator(uuid)
    const { attribution, license } = image ?? {}
    const required = useMemo(() => !isPublicDomainLicenseURL(license), [license])
    const [value, setValue] = useState<string>(attribution ?? "")
    const normalized = useMemo(() => normalizeText(value), [value])
    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }, [])
    const handleFormSubmit = useCallback(() => {
        if (normalized || !required) {
            mutate({ attribution: normalized || null })
        }
    }, [mutate, normalized, required])
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
