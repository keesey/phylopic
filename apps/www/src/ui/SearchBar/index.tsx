import { SearchContext, useExternalResolutions, useMatches } from "@phylopic/ui"
import { extractPath } from "@phylopic/utils"
import clsx from "clsx"
import { useRouter } from "next/router"
import { ChangeEvent, FC, FocusEvent, FormEvent, useContext, useEffect, useState } from "react"
import customEvents from "~/analytics/customEvents"
import styles from "./index.module.scss"
const MAX_MATCHES = 16
const DATALIST_DEBOUNCE_MS = 500
const SearchBar: FC = () => {
    const [state, dispatch] = useContext(SearchContext) ?? []
    const [value, setValue] = useState(state?.text ?? "")
    const [readOnly, setReadOnly] = useState(true)
    const [debouncedMatches, setDebouncedMatches] = useState<string[]>([])
    const { focused, nodeResults: internalResults } = state || {}
    const internalResult = internalResults?.[0]
    const resolution = useExternalResolutions()[0]
    const matches = useMatches(MAX_MATCHES)
    const router = useRouter()
    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedMatches(matches), DATALIST_DEBOUNCE_MS)
        return () => window.clearTimeout(timer)
    }, [matches])
    const enableInput = () => setReadOnly(false)
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
    const handleInputFocus = (event: FocusEvent<HTMLInputElement>) => {
        if (readOnly) {
            event.currentTarget.blur()
            return
        }
        customEvents.toggleSearch(true)
        dispatch?.({ type: "SET_ACTIVE", payload: true })
    }
    return (
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
                autoComplete="off"
                className={clsx(focused && styles.focused)}
                enterKeyHint="search"
                id="q"
                inputMode="search"
                list="autocomplete"
                maxLength={128}
                minLength={2}
                name="q"
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onMouseDown={enableInput}
                onTouchStart={enableInput}
                placeholder="Search for a group of organisms."
                readOnly={readOnly}
                spellCheck={false}
                type="text"
                value={value}
            />
            <datalist id="autocomplete">
                {debouncedMatches.map(match => (
                    <option key={match}>{match}</option>
                ))}
            </datalist>
        </form>
    )
}
export default SearchBar
