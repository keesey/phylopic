import { EmailAddress } from "@phylopic/utils"
import { FC, useCallback, useState } from "react"
import useAuthorized from "~/auth/hooks/useAuthorized"
import Payload from "~/auth/Payload"
import WelcomeBack from "../WelcomeBack"
import EmailForm from "./EmailForm"
import PayloadForm from "./PayloadForm"
const Registration: FC = () => {
    const authorized = useAuthorized()
    const [verified, setVerified] = useState(false)
    const [email, setEmail] = useState<EmailAddress | null>(null)
    const [payload, setPayload] = useState<Payload | null>(null)
    const handleEmailAndPayloadSupplied = useCallback((email: EmailAddress, payload: Payload) => {
        setEmail(email)
        setPayload(payload)
        setVerified(true)
    }, [])
    if (authorized) {
        return <WelcomeBack />
    }
    if (email === null) {
        return (
            <section>
                <p>Ready to upload some silhouette images? Great, let&apos;s get started!</p>
                <p>Please enter your email address:</p>
                <EmailForm onEmailSupplied={setEmail} onEmailAndPayloadSupplied={handleEmailAndPayloadSupplied} />
            </section>
        )
    }
    if (payload === null) {
        return (
            <section>
                <p>Cool. Now how about your name?</p>
                <PayloadForm email={email} onPayloadSupplied={setPayload} />
            </section>
        )
    }
    return (
        <section>
            {!verified && (
                <p>
                    <strong>Nice to meet you, {payload.name}.</strong>
                </p>
            )}
            {verified && (
                <p>
                    <strong>Nice to see you again, {payload.name}!</strong>
                </p>
            )}
            <p>
                I&apos;ve sent an email to you at <cite>{email}</cite> with instructions for continuing.
            </p>
            <p>(Be sure to check your SPAM filter if you don&apos;t see the email.)</p>
            <p>You can close this browser tab now. See you soon!</p>
            <a href={`https://${process.env.NEXT_PUBLIC_WWW_DOMAIN}/images`} className="cta">
                Browse Silhouettes
            </a>
        </section>
    )
}
export default Registration
