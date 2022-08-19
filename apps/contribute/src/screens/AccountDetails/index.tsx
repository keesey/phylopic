import { ChangeEvent, FC, FormEvent, ReactNode, useCallback, useState } from "react"
import useContributorMutator from "~/profile/useContributorMutator"
import useContributorSWR from "~/profile/useContributorSWR"
import Dialogue from "~/ui/Dialogue"
import SiteTitle from "~/ui/SiteTitle"
import ErrorState from "../ErrorState"
import LoadingState from "../LoadingState"
import styles from "./index.module.scss"
export type Props = {
    children?: ReactNode
    submitLabel: string
}
const AccountDetails: FC<Props> = ({ children, submitLabel }) => {
    const { data: contributor, error } = useContributorSWR()
    const [name, setName] = useState("")
    const [showEmailAddress, setShowEmailAddress] = useState(true)
    const handleNameInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }, [])
    const handleShowEmailAddressInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setShowEmailAddress(event.target.checked)
    }, [])
    const mutate = useContributorMutator()
    const handleFormSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            if (contributor && name) {
                const normalized = name.replaceAll(/\s+/g, " ").trim()
                setName(normalized)
                if (!normalized.length) {
                    alert("You have to give me some kind of name.")
                } else {
                    mutate({
                        name,
                        showEmailAddress,
                    })
                }
            }
        },
        [contributor, name, showEmailAddress],
    )
    if (error) {
        return (
            <ErrorState>
                <p>I'm having some trouble loading your profile. Does this mean anything to you?</p>
                <p>&ldquo;{String(error)}&rdquo;</p>
            </ErrorState>
        )
    }
    if (!contributor) {
        return <LoadingState>Checking account&hellip;</LoadingState>
    }
    return (
        <Dialogue>
            {children}
            <form className={styles.main} onSubmit={handleFormSubmit}>
                <input
                    autoComplete="name"
                    id="name"
                    maxLength={128}
                    name="name"
                    onChange={handleNameInputChange}
                    placeholder="Your Full Name, or Alias"
                    required
                    type="text"
                    value={name}
                />
                <div className={styles.field}>
                    <input
                        checked={showEmailAddress}
                        id="showEmailAddress"
                        name="showEmailAddress"
                        onChange={handleShowEmailAddressInputChange}
                        required
                        type="checkbox"
                    />
                    <label htmlFor="showEmailAddress">
                        Allow people to contact you through <SiteTitle />.
                    </label>
                </div>
                <input type="submit" value={submitLabel} />
            </form>
        </Dialogue>
    )
}
export default AccountDetails
