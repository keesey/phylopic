import { FC } from "react"
import customEvents from "~/analytics/customEvents"
import SiteTitle from "~/ui/SiteTitle"
const EngineeringSection: FC = () => (
    <section>
        <h2>Software Engineering</h2>
        <p>
            If you are technically inclined, check out the{" "}
            <a
                href="//github.com/keesey/phylopic"
                onClick={() =>
                    customEvents.clickLink("donate_github", "//github.com/keesey/phylopic", "code repository", "link")
                }
            >
                code repository
            </a>{" "}
            and/or the{" "}
            <a
                href="http://api-docs.phylopic.org/v2"
                onClick={() =>
                    customEvents.clickLink(
                        "donate_api_docs",
                        "http://api-docs.phylopic.org/v2",
                        "API Documentation",
                        "link",
                    )
                }
                rel="help"
            >
                API Documentation
            </a>
            . Think about contributing to <SiteTitle /> or building a tool that uses it.
        </p>
    </section>
)
export default EngineeringSection
