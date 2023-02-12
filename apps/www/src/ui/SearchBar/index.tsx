import { SearchContext, useExternalResolutions, useMatches } from "@phylopic/ui"
import { extractPath } from "@phylopic/utils"
import clsx from "clsx"
import { useRouter } from "next/router"
import { ChangeEvent, FC, FormEvent, useCallback, useContext, useState } from "react"
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
    const handleFormSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const node = internalResult ?? resolution?.node
            if (node) {
                router.push(extractPath(node._links.self.href))
            }
        },
        [resolution?.node, internalResult, router],
    )
    const handleInputBlur = useCallback(() => {
        console.debug("blur")
        dispatch?.({ type: "SET_ACTIVE", payload: false })
    }, [dispatch])
    const handleInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const { value: payload } = event.currentTarget
            console.debug("change", payload)
            setValue(payload)
            dispatch?.({ type: "SET_TEXT", payload })
        },
        [dispatch],
    )
    const handleInputFocus = useCallback(() => {
        console.debug("focus")
        dispatch?.({ type: "SET_ACTIVE", payload: true })
    }, [dispatch])
    return (
        <form className={styles.main} onSubmit={handleFormSubmit} role="search">
            <input
                aria-label="Search for a group of organisms."
                className={clsx(focused && styles.focused)}
                list="autocomplete"
                maxLength={128}
                name="searchName"
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder="Enter the name of a group of organisms."
                type="search"
                value={value}
            />
            <datalist id="autocomplete">
                {matches.map(match => (
                    <option key={match}>{match}</option>
                ))}
            </datalist>
        </form>
    )
}
export default SearchBar
