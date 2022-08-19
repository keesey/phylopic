import { Nomen } from "@phylopic/utils"
import { parseNomen } from "parse-nomen"
import { FC, FormEvent, useCallback, useState } from "react"
import useAutocomplete from "~/search/useAutocomplete"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import UserInput from "~/ui/UserInput"
interface Props {
    onSubmit: (name: Nomen) => void
    placeholder: string
}
const NameForm: FC<Props> = ({ onSubmit, placeholder }) => {
    const [text, setText] = useState("")
    const [name, setName] = useState<Nomen | null>(null)
    const submit = useCallback(() => {
        if (text) {
            const newName = text.trim().length > 2 ? parseNomen(text) : []
            if (newName.length > 0) {
                setName(newName)
                onSubmit(newName)
            }
        }
    }, [onSubmit, text])
    const handleFormSubmit = useCallback(
        (event: FormEvent) => {
            event.preventDefault()
            submit()
        },
        [submit],
    )
    const autocomplete = useAutocomplete(text)
    return (
        <Speech mode="user">
            {name && (
                <p key="submitted">
                    <a onClick={() => setName(null)} role="button">
                        <NameView value={name} />
                    </a>
                    .
                </p>
            )}
            {!name && (
                <form key="form" onSubmit={handleFormSubmit}>
                    <UserInput
                        id="searchName"
                        list="autocomplete"
                        maxLength={128}
                        minLength={2}
                        name="searchName"
                        onBlur={submit}
                        onChange={setText}
                        placeholder={placeholder}
                        type="search"
                        value={text}
                    />
                    <datalist id="autocomplete">
                        {autocomplete.map(value => (
                            <option key={value}>{value}</option>
                        ))}
                    </datalist>
                </form>
            )}
        </Speech>
    )
}
export default NameForm
