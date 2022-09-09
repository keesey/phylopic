import clsx from "clsx"
import { ChangeEvent, FC, HTMLInputTypeAttribute, useCallback } from "react"
import { ICON_CHECK } from "../ICON_SYMBOLS"
import styles from "./index.module.scss"
export interface Props {
    autoComplete?: string
    id?: string
    list?: string
    maxLength?: number
    minLength?: number
    name?: string
    onChange?: (value: string) => void
    placeholder?: string
    required?: boolean
    showSubmit?: boolean
    type?: HTMLInputTypeAttribute
    value?: string
}
const UserInput: FC<Props> = ({
    autoComplete,
    id,
    list,
    maxLength,
    minLength,
    name,
    onChange,
    placeholder,
    required,
    showSubmit,
    type,
    value,
}) => {
    const handleInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange?.(event.target.value)
        },
        [onChange],
    )
    return (
        <div className={styles.main}>
            <input
                autoComplete={autoComplete}
                className={clsx(styles.input, showSubmit && styles.withSubmit)}
                id={id}
                list={list}
                maxLength={maxLength}
                minLength={minLength}
                name={name}
                onChange={handleInputChange}
                placeholder={placeholder}
                required={required}
                type={type}
                value={value}
            />
            {showSubmit && (
                <input className={styles.submit} type="submit" value={ICON_CHECK} />
            )}
        </div>
    )
}
export default UserInput
