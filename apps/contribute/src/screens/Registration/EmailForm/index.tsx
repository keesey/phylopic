import { EmailAddress, isEmailAddress, ValidationFaultCollector } from "@phylopic/utils"
import { ChangeEvent, FC, FormEvent, useCallback, useState } from "react"
export interface Props {
    onSubmit?: (email: EmailAddress) => void
}
const EmailForm: FC<Props> = ({ onSubmit }) => {
    const [value, setValue] = useState("")
    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }, [])
    const handleFormSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const faultCollector = new ValidationFaultCollector()
            if (!isEmailAddress(value, faultCollector.sub("email"))) {
                alert(
                    faultCollector
                        .list()
                        .map(fault => fault.message)
                        .join("\n\n"),
                )
            } else {
                onSubmit?.(value)
            }
        },
        [onSubmit, value],
    )
    return (
        <form onSubmit={handleFormSubmit}>
            <input
                autoComplete="email"
                maxLength={128}
                name="email"
                onChange={handleInputChange}
                placeholder="Your Email Address"
                required
                type="email"
                value={value}
            />
            <input type="submit" value="Continue" />
        </form>
    )
}
export default EmailForm
