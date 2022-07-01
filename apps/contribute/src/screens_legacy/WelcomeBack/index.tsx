import { AnchorLink } from "@phylopic/ui"
import { FC } from "react"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useName from "~/auth/hooks/useContributorUUID"
const WelcomeBack: FC = () => {
    const authorized = useAuthorized()
    const name = useName()
    if (!authorized) {
        return null
    }
    return (
        <section>
            <p>
                {name && (
                    <strong>
                        {name}
                        {"! "}
                    </strong>
                )}
                Welcome back!
            </p>
            <p>Ready to get started?</p>
            <AnchorLink className="cta" href="/images/new">
                Let&apos;s go!
            </AnchorLink>
            {name && (
                <p>
                    <br />
                    <br />
                    <AnchorLink className="text" href="/identity">
                        Hey, I&apos;m not {name}!
                    </AnchorLink>
                </p>
            )}
        </section>
    )
}
export default WelcomeBack
