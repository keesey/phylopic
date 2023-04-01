import type { NextPage } from "next"
import Link from "next/link"
import customEvents from "~/analytics/customEvents"
import SiteTitle from "~/ui/SiteTitle"
const PatreonSection: NextPage = () => (
    <section>
        <h2>Become a Patron</h2>
        <p>
            For as little as $1 a month, you can see previews of new <SiteTitle /> functionality, as well as updates on
            other projects by{" "}
            <Link
                href={`/contributors/${process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID}/t-michael-keesey-silhouettes`}
                onClick={() =>
                    customEvents.clickLink(
                        "donate_patreon_author",
                        `/contributors/${process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID}/t-michael-keesey-silhouettes`,
                        "Mike Keesey",
                        "link",
                    )
                }
            >
                Mike Keesey
            </Link>
            , like the comic book series{" "}
            <a
                href="//www.keesey-comics.com/paleocene"
                onClick={() =>
                    customEvents.clickLink(
                        "donate_patreon_paleocene",
                        "//www.keesey-comics.com/paleocene",
                        "Paleocene",
                        "link",
                    )
                }
                rel="external"
            >
                <cite>Paleocene</cite>
            </a>
            .{" "}
            <a
                href="//www.patreon.com/tmkeesey?fan_landing=true"
                onClick={() =>
                    customEvents.clickLink(
                        "donate_patreon",
                        "//www.patreon.com/tmkeesey?fan_landing=true",
                        "Become a patron!",
                        "link",
                    )
                }
                rel="author"
            >
                Become a patron!
            </a>
        </p>
    </section>
)
export default PatreonSection
