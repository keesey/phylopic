import { Image } from "@phylopic/api-models"
import { useLicenseText } from "@phylopic/ui"
import { extractPath, LicenseURL } from "@phylopic/utils"
import Link from "next/link"
import { FC, Fragment, useMemo } from "react"
import customEvents from "~/analytics/customEvents"
import LicenseTextView from "../LicenseTextView"
import styles from "./index.module.scss"
export interface Props {
    value: Image
}
const useFlags = (value: LicenseURL): Readonly<[boolean, boolean, boolean, boolean, boolean]> => {
    return useMemo(() => {
        switch (value) {
            case "https://creativecommons.org/licenses/by-nc-sa/3.0/": {
                return [false, false, true, true, true]
            }
            case "https://creativecommons.org/licenses/by-nc/3.0/": {
                return [false, false, true, true, false]
            }
            case "https://creativecommons.org/licenses/by-sa/3.0/": {
                return [false, false, true, false, true]
            }
            case "https://creativecommons.org/licenses/by/3.0/":
            case "https://creativecommons.org/licenses/by/4.0/": {
                return [false, false, true, false, false]
            }
            case "https://creativecommons.org/publicdomain/mark/1.0/": {
                return [true, false, false, false, false]
            }
            case "https://creativecommons.org/publicdomain/zero/1.0/": {
                return [false, true, false, false, false]
            }
        }
    }, [value])
}
const LicenseDetailsView: FC<Props> = ({ value }) => {
    const [pdm, cc0, by, nc, sa] = useFlags(value._links.license.href)
    const label = useLicenseText(value._links.license.href)
    return (
        <>
            <ul className={styles.list}>
                {pdm && <li key="pdm">This work has been identified as being free of known restrictions.</li>}
                {cc0 && <li key="cc0">This work has been dedicated to the public domain.</li>}
                {by && (
                    <Fragment key="by">
                        <li>
                            You must give credit to <em>{value.attribution ?? "Anonymous"}</em>.
                        </li>
                        <li>
                            You must provide{" "}
                            <a
                                href={value._links.license.href}
                                onClick={() =>
                                    customEvents.clickLink(
                                        "provide_link",
                                        value._links.license.href,
                                        "a link to the license",
                                        "link",
                                    )
                                }
                                rel="license"
                            >
                                a link to the license
                            </a>
                            .
                        </li>
                        <li>You must indicate if changes were made.</li>
                    </Fragment>
                )}
                {nc && (
                    <li key="nc">
                        You may not use the material for commercial purposes. (But you may{" "}
                        <Link
                            href={extractPath(value._links.contributor.href)}
                            onClick={() =>
                                customEvents.clickContributorLink("contact", {
                                    _links: { self: value._links.contributor },
                                })
                            }
                            rel="author"
                        >
                            contact the contributor
                        </Link>{" "}
                        to request a waiver.)
                    </li>
                )}
                {sa && <li key="sa">You must distribute your work under the same license as the original.</li>}
            </ul>
            <p>
                <a
                    href={value._links.license.href}
                    onClick={() =>
                        customEvents.clickLink(
                            "read_more",
                            value._links.license.href,
                            `Read more about the ${label} license.`,
                            "link",
                        )
                    }
                    rel="license"
                >
                    Read more about the <LicenseTextView value={value._links.license.href} /> license.
                </a>
            </p>
        </>
    )
}
export default LicenseDetailsView
