import { EmailAddress } from "@phylopic/utils"
import { ChangeEvent, FC, useCallback, useContext, useState } from "react"
import AuthContext from "~/auth/AuthContext"
import useEmailAddress from "~/auth/hooks/useEmailAddress"
export interface Props {
    onSubmit?: (email: EmailAddress | null, ttl?: number) => void
}
const DAY = 24 * 60 * 60 * 1000
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const QUARTER = 3 * MONTH
const YEAR = 365 * DAY
const TTL_VALUES = {
    DAY,
    WEEK,
    MONTH,
    QUARTER,
    YEAR,
}
const ReauthorizeForm: FC<Props> = ({ onSubmit }) => {
    const [ttl, setTTL] = useState<keyof typeof TTL_VALUES>("DAY")
    const [, setToken] = useContext(AuthContext) ?? [null, null]
    const emailAddress = useEmailAddress()
    const handleClearClick = useCallback(() => {
        onSubmit?.(null)
        setToken?.(null)
    }, [onSubmit])
    const handleReauthorizeClick = useCallback(() => {
        onSubmit?.(emailAddress, TTL_VALUES[ttl] ?? DAY)
    }, [emailAddress, onSubmit, ttl])
    const handleTTLChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        setTTL(event.target.value as keyof typeof TTL_VALUES)
    }, [])
    return (
        <>
            <div>
                <label htmlFor="ttl">Authorize this device for </label>
                <select onChange={handleTTLChange} value={ttl}>
                    <option value="DAY" label="a day" />
                    <option value="WEEK" label="a week" />
                    <option value="MONTH" label="30 days" />
                    <option value="QUARTER" label="90 days" />
                    <option value="YEAR" label="a year" />
                </select>
                .
            </div>
            <button className="cta" onClick={handleReauthorizeClick}>
                Send Authorization
            </button>
            <p>
                <a className="text" onClick={handleClearClick}>
                    Wait, that isn't my email address!
                </a>
            </p>
        </>
    )
}
export default ReauthorizeForm
