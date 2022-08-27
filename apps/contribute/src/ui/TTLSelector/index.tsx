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
    const handleTTLChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            onChange?.(event.target.value as TTL)
        },
        [onChange],
    )
    return (
        <select
            className={clsx(styles.select, mode && styles[mode], disabled && styles.disabled)}
            disabled={disabled}
            name="ttl"
            onChange={handleTTLChange}
            value={value}
        >
            <option value="DAY">one day</option>
            <option value="WEEK">one week</option>
            <option value="MONTH">30 days</option>
            <option value="QUARTER">90 days</option>
            <option value="YEAR">one year</option>
        </select>
    )
}
export default TTLSelector
