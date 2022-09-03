import { FC } from "react"
import useAutocomplete from "~/search/useAutocomplete"
import UserInput from "~/ui/UserInput"
interface Props {
    onChange: (value: string) => void
    placeholder: string
    value: string
}
const NameInput: FC<Props> = ({ onChange, placeholder, value }) => {
    const autocomplete = useAutocomplete(value)
    return (
        <>
            <UserInput
                id="searchName"
                list="autocomplete"
                maxLength={128}
                minLength={2}
                name="searchName"
                onChange={onChange}
                placeholder={placeholder}
                type="search"
                value={value}
            />
            <datalist id="autocomplete">
                {autocomplete.map(item => (
                    <option key={item}>{item}</option>
                ))}
            </datalist>
        </>
    )
}
export default NameInput
