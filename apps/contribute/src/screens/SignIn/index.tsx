import { EmailAddress, isEmailAddress, ValidationFaultCollector } from "@phylopic/utils"
import { FC, FormEvent, useCallback, useState } from "react"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import EmailInput from "~/ui/EmailInput"
import TTLSelector from "~/ui/TTLSelector"
import { TTL } from "~/ui/TTLSelector/TTL"
import { TTL_VALUES } from "~/ui/TTLSelector/TTL_VALUES"
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
        [onSubmit, email],
    )
    return (
        <DialogueScreen>
            <p>Ready to upload some silhouette images? Great, let&apos;s get started!</p>
            <p>Please enter your email address:</p>
            <form onSubmit={handleFormSubmit}>
                <EmailInput value={email} onChange={setEmail} />
                <br />
                <TTLSelector onChange={setTTL} value={ttl} />
                <br />
                <input type="submit" value="Continue" />
            </form>
        </DialogueScreen>
    )
}
export default SignIn
