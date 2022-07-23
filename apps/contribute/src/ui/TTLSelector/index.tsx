import clsx from "clsx"
import { ChangeEvent, FC, useCallback } from "react"
import styles from "./index.module.scss"
import { TTL } from "./TTL"
export interface Props {
    disabled?: boolean
    mode?: "light"
    onChange?: (value: TTL) => void
    value?: TTL
}
const TTLSelector: FC<Props> = ({ disabled, mode, onChange, value }) => {
    const handleTTLChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(event.target.value as TTL)
    }, [])
    return (
        <select
            className={clsx(styles.select, mode && styles[mode], disabled && styles.disabled)}
            disabled={disabled}
            name="ttl"
            onChange={handleTTLChange}
            value={value}
        >
            <option value="DAY" label="one day" />
            <option value="WEEK" label="one week" />
            <option value="MONTH" label="30 days" />
            <option value="QUARTER" label="90 days" />
            <option value="YEAR" label="one year" />
        </select>
    )
}
export default TTLSelector
