import { EmailAddress } from "@phylopic/utils"
import { ChangeEvent, FC, useCallback } from "react"
export interface Props {
    onChange?: (email: EmailAddress) => void
    value?: EmailAddress
}
const EmailInput: FC<Props> = ({ onChange, value }) => {
    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value)
    }, [])
    return (
        <input
            autoComplete="email"
            id="email"
            maxLength={128}
            name="email"
            onChange={handleInputChange}
            placeholder="Your Email Address"
            required
            type="email"
            value={value}
        />
    )
}
export default EmailInput
