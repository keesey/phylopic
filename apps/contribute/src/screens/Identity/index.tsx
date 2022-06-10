import { FC } from "react"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useEmailAddress from "~/auth/hooks/useEmailAddress"
import AnchorLink from "~/ui/AnchorLink"
const Identity: FC = () => {
    const authorized = useAuthorized()
    const email = useEmailAddress()
    if (!authorized) {
        return (
            <section>
                <p>I don&apos;t know who you are.</p>
                <AnchorLink href="/" className="cta">
                    Start Over?
                </AnchorLink>
            </section>
        )
    }
    return (
        <section>
            <p>You&apos;re not? Is this your email address?</p>
            <p>
                <strong>{email}</strong>
            </p>
            <AnchorLink href="/rename" className="cta">
                Yes!
            </AnchorLink>
            <AnchorLink href="/logout" className="cta">
                No!
            </AnchorLink>
        </section>
    )
}
export default Identity
