import React, { DetailedHTMLProps, InputHTMLAttributes, KeyboardEvent, useCallback, FC } from "react"
import { isUUID, UUID } from "@phylopic/utils"
import styles from "./index.module.scss"

export type Props = Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "className" | "onKeyDownCapture" | "onSelect" | "type"
> & {
    onSelect: (value: UUID) => void
}
const UUIDSelector: FC<Props> = ({ onSelect, ...inputProps }) => {
    const inputKeyDownCallback = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            switch (event.key) {
                case "Enter": {
                    event.preventDefault()
                    const { value } = event.currentTarget
                    if (!isUUID(value.trim())) {
                        return alert("Not a valid UUID.")
                    }
                    onSelect(value.trim().toLowerCase())
                    event.currentTarget.blur()
                    break
                }
            }
        },
        [onSelect],
    )
    return <input {...inputProps} className={styles.main} onKeyDownCapture={inputKeyDownCallback} type="text" />
}
export default UUIDSelector
