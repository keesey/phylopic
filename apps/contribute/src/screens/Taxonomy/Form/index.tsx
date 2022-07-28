import { ChangeEvent, FC, FormEvent, useCallback, useState } from "react"
import useAutocomplete from "~/search/useAutocomplete"
import styles from "./index.module.scss"
interface Props {
    onComplete?: (searchTerm: string) => void
    suggestion?: string
}
const Form: FC<Props> = ({ onComplete, suggestion = "" }) => {
    const [text, setText] = useState("")
    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
    }, [])
    const complete = useCallback(() => {
        if (text) {
            onComplete?.(text)
        }
    }, [onComplete, text])
    const handleFormSubmit = useCallback(
        (event: FormEvent) => {
            event.preventDefault()
            complete()
        },
        [complete],
    )
    const autocomplete = useAutocomplete(text)
    return (
        <form className={styles.form} onSubmit={handleFormSubmit}>
            <input
                id="searchName"
                list="autocomplete"
                maxLength={128}
                minLength={2}
                name="searchName"
                onBlur={complete}
                onChange={handleInputChange}
                placeholder="Species or other taxonomic group"
                type="search"
                value={text || suggestion}
            />
            <datalist id="autocomplete">
                {autocomplete.map(value => (
                    <option key={value}>{value}</option>
                ))}
            </datalist>
        </form>
    )
}
export default Form
