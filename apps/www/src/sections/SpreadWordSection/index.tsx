import { FC } from "react"
import customEvents from "~/analytics/customEvents"
import SiteTitle from "~/ui/SiteTitle"
const SpreadWordSection: FC = () => (
    <section>
        <h2>Spread the Word!</h2>
        <p>
            Tell people about{" "}
            <a
                href={`${process.env.NEXT_PUBLIC_WWW_URL}`}
                onClick={() =>
                    customEvents.clickLink(
                        "donate_spread_word",
                        `${process.env.NEXT_PUBLIC_WWW_URL}`,
                        "PhyloPic",
                        "link",
                    )
                }
            >
                <SiteTitle />
            </a>
            !
        </p>
    </section>
)
export default SpreadWordSection
