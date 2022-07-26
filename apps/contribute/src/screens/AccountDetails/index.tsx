import { Contributor, isContributor } from "@phylopic/source-models"
import { EmailAddress, UUID, ValidationFaultCollector } from "@phylopic/utils"
import { ChangeEvent, FC, FormEvent, useCallback, useState } from "react"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import SiteTitle from "~/ui/SiteTitle"
import styles from "./index.module.scss"
export interface Props {
    emailAddress?: EmailAddress | null
    onSubmit?: (payload: Contributor) => void
    uuid?: UUID | null
}
const AccountDetails: FC<Props> = ({ emailAddress, onSubmit, uuid }) => {
    const [name, setName] = useState("")
    const [showEmailAddress, setShowEmailAddress] = useState(true)
    const handleNameInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }, [])
    const handleShowEmailAddressInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setShowEmailAddress(event.target.checked)
    }, [])
    const handleFormSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            if (emailAddress && name) {
                const normalized = name.replaceAll(/\s+/g, " ").trim()
                setName(normalized)
                if (!normalized.length) {
                    alert("You have to give me some kind of name.")
                } else if (onSubmit) {
                    const value = {
                        created: new Date().toISOString(),
                        emailAddress,
                        name,
                        showEmailAddress,
                    }
                    const collector = new ValidationFaultCollector()
                    if (!isContributor(value, collector)) {
                        alert(
                            `Whoops!\n\n${collector
                                .list()
                                .map(fault => fault.message)
                                .join("\n")}`,
                        )
                    }
                    onSubmit(value)
                }
            }
        },
        [emailAddress, name, showEmailAddress],
    )
    return (
        <DialogueScreen>
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
                <input type="submit" value="Continue" />
            </form>
        </DialogueScreen>
    )
}
export default AccountDetails
