import { EmailAddress } from "@phylopic/utils"
import axios from "axios"
import { ChangeEvent, FC, FormEvent, useCallback, useEffect, useState } from "react"
import useSWR, { Fetcher } from "swr"
import Payload from "~/auth/Payload"
export interface Props {
    email?: EmailAddress
    onPayloadSupplied?: (payload: Payload) => void
}
type SWRKey = [string, string]
const fetcher: Fetcher<true, SWRKey> = async (url: string, name: string) => {
    const response = await axios.post(url, { name })
    if (response.status === 204) {
        return true as true
    }
    throw new Error("Unexpected response.")
}
const PayloadForm: FC<Props> = ({ email, onPayloadSupplied }) => {
    const [name, setName] = useState("")
    const [swrKey, setSWRKey] = useState<SWRKey | null>(null)
    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }, [])
    const { data, isValidating, error } = useSWR<true, SWRKey>(swrKey, fetcher)
    const handleFormSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            if (email) {
                const normalized = name.trim().replaceAll(/\s+/g, " ")
                setName(normalized)
                if (!normalized.length) {
                    alert("You gotta give me something.")
                } else {
                    setSWRKey([`/api/authorize/${encodeURIComponent(email)}`, normalized])
                }
            }
        },
        [email, name],
    )
    useEffect(() => {
        if (error) {
            alert(error)
            setSWRKey(null)
        }
    }, [error])
    useEffect(() => {
        if (data === true) {
            onPayloadSupplied?.({ name })
        }
    }, [data, name, onPayloadSupplied])
    return (
        <form onSubmit={handleFormSubmit}>
            <input
                autoComplete="name"
                disabled={isValidating}
                maxLength={128}
                name="name"
                onChange={handleInputChange}
                placeholder="Your Full Name"
                required
                type="text"
                value={name}
            />
            <input disabled={isValidating} type="submit" value="Continue" />
        </form>
    )
}
export default PayloadForm
