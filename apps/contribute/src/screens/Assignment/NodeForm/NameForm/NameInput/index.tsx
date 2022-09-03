import { SearchContext, useMatches } from "@phylopic/ui"
import { FC, useContext, useEffect, useState } from "react"
import UserInput from "~/ui/UserInput"
interface Props {
    placeholder: string
}
const NameInput: FC<Props> = ({ placeholder }) => {
    const matches = useMatches()
    const [{ text }, dispatch] = useContext(SearchContext) ?? [{}]
    const [value, setValue] = useState(text ?? "")
    useEffect(() => {
        dispatch?.({ type: "SET_TEXT", payload: value })
    }, [dispatch, value])
    return (
        <>
            <UserInput
                id="searchName"
                list="autocomplete"
                maxLength={128}
                minLength={2}
                name="searchName"
                onChange={setValue}
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
