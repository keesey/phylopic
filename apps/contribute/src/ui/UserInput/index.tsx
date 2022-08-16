import { ChangeEvent, FC, HTMLInputTypeAttribute, useCallback } from "react"
import styles from "./index.module.scss"
export interface Props {
    autocomplete?: string
    id?: string
    maxLength?: number
    name?: string
    onChange?: (value: string) => void
    placeholder?: string
    required?: boolean
    type?: HTMLInputTypeAttribute
    value?: string
}
const UserInput: FC<Props> = ({ autocomplete, id, maxLength, name, onChange, placeholder, required, type, value }) => {
    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value)
    }, [])
    return (
        <input
            autoComplete={autocomplete}
            className={styles.main}
            id={id}
            maxLength={maxLength}
            name={name}
            onChange={handleInputChange}
            placeholder={placeholder}
            required={required}
            type={type}
            value={value}
        />
    )
}
export default UserInput
