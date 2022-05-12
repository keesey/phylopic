import { isNomen, Nomen } from "@phylopic/utils"
import { parseNomen } from "parse-nomen"
import React, {
    DetailedHTMLProps,
    FC,
    InputHTMLAttributes,
    KeyboardEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react"
import styles from "./index.module.scss"

export type Props = Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "className" | "onChange" | "onKeyDownCapture" | "onSelect" | "type" | "value"
> & {
    onSelect: (value: Nomen) => void
    value?: Nomen
}
const NameSelector: FC<Props> = ({ onSelect, value, ...inputProps }) => {
    const [textValue, setTextValue] = useState("")
    const valueText = useMemo(() => value?.map(({ text }) => text).join(" "), [value])
    useEffect(() => {
        if (valueText) {
            setTextValue(valueText)
        }
    }, [valueText])
    const inputKeyDownCallback = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            switch (event.key) {
                case "Enter": {
                    event.preventDefault()
                    const value = parseNomen(event.currentTarget.value)
                    if (!isNomen(value)) {
                        return alert("Not a valid name.")
                    }
                    setTextValue("")
                    event.currentTarget.blur()
                    onSelect(value)
                    break
                }
            }
        },
        [onSelect],
    )
    return (
        <input
            {...inputProps}
            className={styles.main}
            onChange={event => setTextValue(event.currentTarget.value)}
            onKeyDownCapture={inputKeyDownCallback}
            type="text"
            value={textValue}
        />
    )
}
export default NameSelector
