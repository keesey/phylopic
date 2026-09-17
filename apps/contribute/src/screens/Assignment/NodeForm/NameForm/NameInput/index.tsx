import { useMatches } from "@phylopic/client-components"
import { FC } from "react"
import UserInput from "~/ui/UserInput"
interface Props {
    onChange: (value: string) => void
    placeholder: string
    value: string
}
const NameInput: FC<Props> = ({ onChange, placeholder, value }) => {
    const matches = useMatches()
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
                {matches.map(match => (
                    <option key={match}>{match}</option>
                ))}
            </datalist>
        </>
    )
}
export default NameInput
