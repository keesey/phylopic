"use client"
import { SearchContext, useMatches } from "@phylopic/client-components"
import clsx from "clsx"
import { ChangeEvent, FC, useContext, useState } from "react"
import styles from "./SearchInput.module.scss"
const MAX_MATCHES = 16
export const SearchInput: FC = () => {
    const [state, dispatch] = useContext(SearchContext) ?? []
    const [value, setValue] = useState(state?.text ?? "")
    const { focused } = state || {}
    const matches = useMatches(MAX_MATCHES)
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value: payload } = event.currentTarget
        setValue(payload)
        dispatch?.({ type: "SET_TEXT", payload })
    }
    return (
        <div className={styles.main} role="search">
            <input
                className={clsx(focused && styles.focused)}
                id="q"
                list="autocomplete"
                maxLength={128}
                minLength={2}
                name="q"
                onChange={handleInputChange}
                placeholder="Search for images."
                spellCheck={false}
                type="search"
                value={value}
            />
            <datalist id="autocomplete">
                {matches.map(match => (
                    <option key={match}>{match}</option>
                ))}
            </datalist>
        </div>
    )
}
