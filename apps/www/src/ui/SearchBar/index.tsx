import { SearchContext, useExternalResolutions, useMatches } from "@phylopic/client-components"
import { extractPath } from "@phylopic/utils"
import clsx from "clsx"
import { useRouter } from "next/router"
import { ChangeEvent, FC, FormEvent, useContext, useState } from "react"
import customEvents from "~/analytics/customEvents"
import styles from "./index.module.scss"
const MAX_MATCHES = 16
const SearchBar: FC = () => {
    const [state, dispatch] = useContext(SearchContext) ?? []
    const [value, setValue] = useState(state?.text ?? "")
    const { focused, nodeResults: internalResults } = state || {}
    const internalResult = internalResults?.[0]
    const resolution = useExternalResolutions()[0]
    const matches = useMatches(MAX_MATCHES)
    const router = useRouter()
    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        customEvents.submitForm("search")
        const node = internalResult ?? resolution?.node
        if (node) {
            customEvents.searchDirect(value, node)
            router.push(extractPath(node._links.self.href))
        }
    }
    const handleInputBlur = () => {
        customEvents.toggleSearch(false)
        dispatch?.({ type: "SET_ACTIVE", payload: false })
    }
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value: payload } = event.currentTarget
        setValue(payload)
        customEvents.search(payload)
        dispatch?.({ type: "SET_TEXT", payload })
    }
    const handleInputFocus = () => {
        customEvents.toggleSearch(true)
        dispatch?.({ type: "SET_ACTIVE", payload: true })
    }
    return (
        <>
            <form className={styles.focusStealer}>
                <input type="search" />
            </form>
            <form
                action="/search"
                aria-label="Taxonomic"
                className={styles.main}
                onSubmit={handleFormSubmit}
                role="search"
            >
                <p id="search-description" style={{ display: "none" }}>
                    Search for a taxonomic group by typing in the name.
                </p>
                <input
                    aria-describedby="search-description"
                    aria-label="Search for a group of organisms."
                    className={clsx(focused && styles.focused)}
                    id="q"
                    list="autocomplete"
                    maxLength={128}
                    minLength={2}
                    name="q"
                    onBlur={handleInputBlur}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder="Search for a group of organisms."
                    spellCheck={false}
                    type="search"
                    value={value}
                />
                <datalist id="autocomplete">
                    {matches.map(match => (
                        <option key={match}>{match}</option>
                    ))}
                </datalist>
            </form>
        </>
    )
}
export default SearchBar
