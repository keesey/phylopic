import { EmailAddress, isEmailAddress, ValidationFaultCollector } from "@phylopic/utils"
import axios from "axios"
import { ChangeEvent, FC, FormEvent, useCallback, useEffect, useState } from "react"
import useSWR from "swr"
import isPayload from "~/auth/isPayload"
import Payload from "~/auth/Payload"
import fetcher from "~/swr/fetcher"
export interface Props {
    onEmailSupplied?: (email: EmailAddress) => void
    onEmailAndPayloadSupplied?: (email: EmailAddress, payload: Payload) => void
}
const EmailForm: FC<Props> = ({ onEmailSupplied, onEmailAndPayloadSupplied }) => {
    const [value, setValue] = useState("")
    const [swrKey, setSWRKey] = useState<string | null>(null)
    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }, [])
    const { data, isValidating, error } = useSWR<string | null>(swrKey, fetcher)
    const handleFormSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const faultCollector = new ValidationFaultCollector()
            if (!isEmailAddress(value, faultCollector.sub("email"))) {
                setSWRKey(null)
                alert(faultCollector.list().map(fault => fault.message).join("\n\n"))
            } else {
                setSWRKey(`/api/authorize/${encodeURIComponent(value)}`)
            }
        },
        [value],
    )
    useEffect(() => {
        if (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                onEmailSupplied?.(value)
            } else {
                alert(error)
            }
            setSWRKey(null)
        }
    }, [error, onEmailSupplied, value])
    useEffect(() => {
        if (value && isPayload(data)) {
            onEmailAndPayloadSupplied?.(value, data)
        }
    }, [data, onEmailAndPayloadSupplied, value])
    return (
        <form onSubmit={handleFormSubmit}>
            <input
                autoComplete="email"
                disabled={isValidating}
                maxLength={128}
                name="email"
                onChange={handleInputChange}
                placeholder="Your Email Address"
                required
                type="email"
                value={value}
            />
            <input disabled={isValidating} type="submit" value="Continue" />
        </form>
    )
}
export default EmailForm
