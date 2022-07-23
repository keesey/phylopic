import { ChangeEvent, FC, useCallback } from "react"
import { TTL } from "./TTL"
import styles from "./index.module.scss"
import DEFAULT_TTL from "~/auth/ttl/DEFAULT_TTL"
import clsx from "clsx"
export interface Props {
    mode?: "light";
    onChange?: (value: TTL) => void
    value?: TTL
}
const TTLSelector: FC<Props> = ({ mode, onChange, value }) => {
    const handleTTLChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(event.target.value as TTL)
    }, [])
    return (
        <select
            className={clsx(styles.select, mode && styles[mode])}
            name="ttl"
            onChange={handleTTLChange}
            value={value}
            defaultValue={DEFAULT_TTL}
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
