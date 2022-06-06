import { normalizeText, ValidLicenseURL } from "@phylopic/utils"
import { ChangeEvent, FC, useCallback, useMemo, useState } from "react"
export interface Props {
    licenseURL?: ValidLicenseURL
    onComplete?: (value: string | undefined) => void
    suggestion?: string | null
}
const Attribution: FC<Props> = ({ licenseURL, onComplete, suggestion }) => {
    const required = licenseURL === "https://creativecommons.org/licenses/by/4.0/"
    const [value, setValue] = useState<string>(suggestion ?? "")
    const normalized = useMemo(() => normalizeText(value), [value])
    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }, [])
    const handleFormSubmit = useCallback(() => {
        if (normalized || !required) {
            onComplete?.(normalized || undefined)
        }
    }, [normalized, onComplete])
    return (
        <form onSubmit={handleFormSubmit}>
            <input
                onChange={handleInputChange}
                placeholder={`Who gets the credit for this?${required ? "" : " (optional)"}`}
                required={required}
                type="text"
            />
            <input type="submit" value="Next Step" />
        </form>
    )
}
export default Attribution
