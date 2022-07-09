import { ChangeEvent, FC, useCallback } from "react"
import { TTL } from "./TTL"
export interface Props {
    onChange?: (value: TTL) => void
    value?: TTL
}
const TTLSelector: FC<Props> = ({ onChange, value }) => {
    const handleTTLChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(event.target.value as TTL)
    }, [])
    return (
        <>
            <label htmlFor="ttl">Authorize this device for </label>
            <select id="ttl" name="ttl" onChange={handleTTLChange} value={value}>
                <option value="DAY" label="a day" />
                <option value="WEEK" label="a week" />
                <option value="MONTH" label="30 days" />
                <option value="QUARTER" label="90 days" />
                <option value="YEAR" label="a year" />
            </select>
            .
        </>
    )
}
export default TTLSelector
