import { EmailAddress, isEmailAddress, ValidationFaultCollector } from "@phylopic/utils"
import { FC, FormEvent, useCallback, useMemo, useState } from "react"
import Dialogue from "~/ui/Dialogue"
import { ICON_ARROW_RIGHT } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import TTLSelector from "~/ui/TTLSelector"
import { TTL } from "~/ui/TTLSelector/TTL"
import { TTL_VALUES } from "~/ui/TTLSelector/TTL_VALUES"
import UserInput from "~/ui/UserInput"
import UserOptions from "~/ui/UserOptions"
import styles from "./index.module.scss"
export interface Props {
    onSubmit?: (email: EmailAddress, ttl: number) => void
}
const SignIn: FC<Props> = ({ onSubmit }) => {
    const [email, setEmail] = useState<EmailAddress>("")
    const [ttl, setTTL] = useState<TTL>("DAY")
    const handleFormSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const faultCollector = new ValidationFaultCollector()
            if (!isEmailAddress(email, faultCollector.sub("email"))) {
                alert(
                    faultCollector
                        .list()
                        .map(fault => fault.message)
                        .join("\n\n"),
                )
            } else {
                onSubmit?.(email, TTL_VALUES[ttl])
            }
        },
        [onSubmit, email, ttl],
    )
    const hasEmail = useMemo(() => isEmailAddress(email), [email])
    return (
        <Dialogue>
            <Speech mode="system">
                <p>
                    Ready to upload some silhouette images? <strong>Great!</strong> Let&apos;s get started.
                </p>
                <p>Please enter your email address.</p>
            </Speech>
            <form className={styles.form} onSubmit={handleFormSubmit}>
                <Speech mode="user">
                    <UserInput
                        autoComplete="email"
                        id="email"
                        maxLength={128}
                        name="email"
                        onChange={setEmail}
                        required
                        showSubmit
                        type="email"
                        placeholder="Email address"
                    />
                </Speech>
                {hasEmail && (
                    <>
                        <Speech mode="user">
                            <label>
                                Authorize this device for <TTLSelector onChange={setTTL} value={ttl} />.
                            </label>
                        </Speech>
                        <Speech mode="system">
                            <small>(You may log out at any time.)</small>
                        </Speech>
                        <UserOptions>
                            <UserInput type="submit" value={`${ICON_ARROW_RIGHT} Continue`} />
                        </UserOptions>
                    </>
                )}
            </form>
        </Dialogue>
    )
}
export default SignIn
