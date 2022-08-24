import { ChangeEvent, FC, HTMLInputTypeAttribute, useCallback } from "react"
import styles from "./index.module.scss"
export interface Props {
    autoComplete?: string
    id?: string
    list?: string
    maxLength?: number
    minLength?: number
    name?: string
    onBlur?: () => void
    onChange?: (value: string) => void
    placeholder?: string
    required?: boolean
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
    onBlur,
    onChange,
    placeholder,
    required,
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
        <input
            autoComplete={autoComplete}
            className={styles.main}
            id={id}
            list={list}
            maxLength={maxLength}
            minLength={minLength}
            name={name}
            onBlur={onBlur}
            onChange={handleInputChange}
            placeholder={placeholder}
            required={required}
            type={type}
            value={value}
        />
    )
}
export default UserInput
