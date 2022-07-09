import { ChangeEvent, FC, useCallback } from "react"
import { TTL } from "./TTL"
import styles from "./index.module.scss"
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
            <select className={styles.select} id="ttl" name="ttl" onChange={handleTTLChange} value={value}>
                <option value="DAY" label="one day" />
                <option value="WEEK" label="one week" />
                <option value="MONTH" label="30 days" />
                <option value="QUARTER" label="90 days" />
                <option value="YEAR" label="one year" />
            </select>
            .<br />
            <small>(You may log out at any time.)</small>
        </>
    )
}
export default TTLSelector
